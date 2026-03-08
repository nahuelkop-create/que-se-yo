// Servicio unificado de precios para cualquier tipo de activo
// Usa CoinGecko para crypto (sin key), Alpha Vantage para acciones/ETFs (con key), mock para bonos/índices locales

import { mockCryptoData, mockStockData, getMockPriceData, getMockHistoryByPeriod } from '../data/mockData';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query';

// Period to CoinGecko days mapping
const PERIOD_TO_DAYS = { '1D': 1, '1W': 7, '1M': 30, '1Y': 365, 'MAX': 'max' };

/**
 * Fetch OHLCV history for a specific period
 * Returns lightweight-charts format: { time, open, high, low, close, volume? }[]
 */
export async function fetchAssetHistory(asset, period = '1M', settings = {}) {
  try {
    if (asset.source === 'coingecko') {
      return await fetchCoinGeckoOHLC(asset, period);
    }
    if (asset.source === 'alphavantage' && settings.alphaVantageKey) {
      return await fetchAlphaVantageHistory(asset, period, settings.alphaVantageKey);
    }
    // Mock fallback for assets without API (bonos, indices locales)
    return getMockHistoryByPeriod(asset.id, period, asset.category);
  } catch (error) {
    console.warn(`Error obteniendo historial de ${asset.ticker}:`, error.message);
    return getMockHistoryByPeriod(asset.id, period, asset.category);
  }
}

/**
 * Fetch OHLC data from CoinGecko + volume from market_chart
 */
async function fetchCoinGeckoOHLC(asset, period) {
  const days = PERIOD_TO_DAYS[period] || 30;

  // Fetch OHLC for candlestick data
  const ohlcRes = await fetch(
    `${COINGECKO_BASE}/coins/${asset.sourceId}/ohlc?vs_currency=usd&days=${days}`
  );
  if (!ohlcRes.ok) throw new Error(`CoinGecko OHLC error: ${ohlcRes.status}`);
  const ohlcData = await ohlcRes.json();

  // Also fetch market_chart for volume data
  let volumeMap = {};
  try {
    const mcRes = await fetch(
      `${COINGECKO_BASE}/coins/${asset.sourceId}/market_chart?vs_currency=usd&days=${days}`
    );
    if (mcRes.ok) {
      const mcData = await mcRes.json();
      if (mcData.total_volumes) {
        for (const [ts, vol] of mcData.total_volumes) {
          // Round to nearest hour for matching with OHLC timestamps
          const key = Math.round(ts / 3600000) * 3600000;
          volumeMap[key] = vol;
        }
      }
    }
  } catch { /* volume is optional */ }

  return ohlcData.map(([ts, open, high, low, close]) => {
    // Find closest volume entry
    const volKey = Math.round(ts / 3600000) * 3600000;
    const volume = volumeMap[volKey] || null;

    return {
      time: period === '1D'
        ? Math.floor(ts / 1000)
        : new Date(ts).toISOString().split('T')[0],
      open, high, low, close,
      volume: volume ? Math.round(volume) : undefined,
    };
  });
}

/**
 * Fetch history from Alpha Vantage for stocks/ETFs
 */
async function fetchAlphaVantageHistory(asset, period, apiKey) {
  // For intraday (1D), use INTRADAY endpoint
  if (period === '1D') {
    const res = await fetch(
      `${ALPHA_VANTAGE_BASE}?function=TIME_SERIES_INTRADAY&symbol=${asset.sourceId}&interval=5min&apikey=${apiKey}`
    );
    if (!res.ok) throw new Error(`AV intraday error: ${res.status}`);
    const data = await res.json();
    const ts = data['Time Series (5min)'];
    if (!ts) throw new Error(data.Note || data.Information || 'No data');

    return Object.entries(ts).slice(0, 78).reverse().map(([datetime, v]) => ({
      time: Math.floor(new Date(datetime).getTime() / 1000),
      open: parseFloat(v['1. open']),
      high: parseFloat(v['2. high']),
      low: parseFloat(v['3. low']),
      close: parseFloat(v['4. close']),
      volume: parseInt(v['5. volume']),
    }));
  }

  // For daily+ periods, use TIME_SERIES_DAILY
  const outputsize = (period === '1Y' || period === 'MAX') ? 'full' : 'compact';
  const res = await fetch(
    `${ALPHA_VANTAGE_BASE}?function=TIME_SERIES_DAILY&symbol=${asset.sourceId}&outputsize=${outputsize}&apikey=${apiKey}`
  );
  if (!res.ok) throw new Error(`AV daily error: ${res.status}`);
  const data = await res.json();
  const ts = data['Time Series (Daily)'];
  if (!ts) throw new Error(data.Note || data.Information || 'No data');

  const entries = Object.entries(ts);
  const limit = { '1W': 7, '1M': 30, '1Y': 252, 'MAX': entries.length }[period] || 30;

  return entries.slice(0, limit).reverse().map(([date, v]) => ({
    time: date,
    open: parseFloat(v['1. open']),
    high: parseFloat(v['2. high']),
    low: parseFloat(v['3. low']),
    close: parseFloat(v['4. close']),
    volume: parseInt(v['5. volume']),
  }));
}

/**
 * Fetch current price + basic data for an asset
 * Returns normalized: { price, change, changePercent, marketCap, volume, high24h, low24h, priceHistory }
 */
export async function fetchAssetPrice(asset, settings = {}) {
  try {
    if (asset.source === 'coingecko') {
      return await fetchCoinGeckoPrice(asset);
    }
    if (asset.source === 'alphavantage' && settings.alphaVantageKey) {
      return await fetchAlphaVantagePrice(asset, settings.alphaVantageKey);
    }
    // No API available — use mock
    return getMockAssetPrice(asset);
  } catch (error) {
    console.warn(`Error obteniendo precio de ${asset.ticker}:`, error.message);
    return getMockAssetPrice(asset);
  }
}

/**
 * Fetch price from CoinGecko (crypto)
 */
async function fetchCoinGeckoPrice(asset) {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/${asset.sourceId}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true`
  );
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);

  const data = await res.json();
  const md = data.market_data;

  // Also fetch history for analysis
  let priceHistory = [];
  try {
    const histRes = await fetch(
      `${COINGECKO_BASE}/coins/${asset.sourceId}/market_chart?vs_currency=usd&days=60`
    );
    if (histRes.ok) {
      const histData = await histRes.json();

      // Build better OHLCV from market_chart data
      const prices = histData.prices || [];
      const volumes = histData.total_volumes || [];

      // Group by day for daily candles
      const dayMap = {};
      for (const [ts, price] of prices) {
        const day = new Date(ts).toISOString().split('T')[0];
        if (!dayMap[day]) dayMap[day] = { prices: [], volumes: [] };
        dayMap[day].prices.push(price);
      }
      for (const [ts, vol] of volumes) {
        const day = new Date(ts).toISOString().split('T')[0];
        if (dayMap[day]) dayMap[day].volumes.push(vol);
      }

      priceHistory = Object.entries(dayMap).map(([date, { prices: ps, volumes: vs }]) => ({
        date,
        open: parseFloat(ps[0].toFixed(2)),
        high: parseFloat(Math.max(...ps).toFixed(2)),
        low: parseFloat(Math.min(...ps).toFixed(2)),
        close: parseFloat(ps[ps.length - 1].toFixed(2)),
        price: parseFloat(ps[ps.length - 1].toFixed(2)),
        volume: vs.length > 0 ? Math.round(vs.reduce((a, b) => a + b, 0) / vs.length) : 0,
      }));
    }
  } catch { /* use empty history */ }

  return {
    price: md.current_price?.usd || 0,
    change: md.price_change_24h || 0,
    changePercent: md.price_change_percentage_24h || 0,
    marketCap: md.market_cap?.usd || null,
    volume: md.total_volume?.usd || null,
    high24h: md.high_24h?.usd || null,
    low24h: md.low_24h?.usd || null,
    sparkline: data.market_data?.sparkline_7d?.price || [],
    priceHistory,
    image: data.image?.small || asset.image,
    rank: data.market_cap_rank || null,
  };
}

/**
 * Fetch price from Alpha Vantage (stocks, ETFs, indices)
 */
async function fetchAlphaVantagePrice(asset, apiKey) {
  // Global quote for current price
  const quoteRes = await fetch(
    `${ALPHA_VANTAGE_BASE}?function=GLOBAL_QUOTE&symbol=${asset.sourceId}&apikey=${apiKey}`
  );
  if (!quoteRes.ok) throw new Error(`AV error: ${quoteRes.status}`);
  const quoteData = await quoteRes.json();
  const gq = quoteData['Global Quote'];

  if (!gq || !gq['05. price']) {
    throw new Error(quoteData.Note || quoteData.Information || 'Sin datos');
  }

  // Daily time series for history
  let priceHistory = [];
  try {
    const histRes = await fetch(
      `${ALPHA_VANTAGE_BASE}?function=TIME_SERIES_DAILY&symbol=${asset.sourceId}&outputsize=compact&apikey=${apiKey}`
    );
    if (histRes.ok) {
      const histData = await histRes.json();
      const ts = histData['Time Series (Daily)'];
      if (ts) {
        priceHistory = Object.entries(ts).slice(0, 60).reverse().map(([date, v]) => ({
          date,
          open: parseFloat(v['1. open']),
          high: parseFloat(v['2. high']),
          low: parseFloat(v['3. low']),
          close: parseFloat(v['4. close']),
          price: parseFloat(v['4. close']),
          volume: parseInt(v['5. volume']),
        }));
      }
    }
  } catch { /* use empty history */ }

  return {
    price: parseFloat(gq['05. price']),
    change: parseFloat(gq['09. change'] || 0),
    changePercent: parseFloat((gq['10. change percent'] || '0').replace('%', '')),
    marketCap: null,
    volume: parseInt(gq['06. volume'] || 0),
    high24h: parseFloat(gq['03. high'] || 0),
    low24h: parseFloat(gq['04. low'] || 0),
    sparkline: priceHistory.slice(-7).map(d => d.close),
    priceHistory,
    image: null,
    rank: null,
  };
}

/**
 * Get mock price data for any asset
 */
function getMockAssetPrice(asset) {
  // Check existing mock data first
  const existingCrypto = mockCryptoData.find(c => c.id === asset.sourceId);
  if (existingCrypto) {
    return {
      price: existingCrypto.current_price,
      change: existingCrypto.current_price * (existingCrypto.price_change_percentage_24h / 100),
      changePercent: existingCrypto.price_change_percentage_24h,
      marketCap: existingCrypto.market_cap,
      volume: existingCrypto.total_volume,
      high24h: existingCrypto.current_price * 1.02,
      low24h: existingCrypto.current_price * 0.98,
      sparkline: existingCrypto.sparkline_in_7d?.price || [],
      priceHistory: existingCrypto.priceHistory || [],
      image: existingCrypto.image,
      rank: null,
    };
  }

  const existingStock = mockStockData.find(s => s.symbol === asset.sourceId);
  if (existingStock) {
    const latest = existingStock.priceHistory[existingStock.priceHistory.length - 1];
    const prev = existingStock.priceHistory[existingStock.priceHistory.length - 2] || latest;
    return {
      price: latest.close,
      change: latest.close - prev.close,
      changePercent: ((latest.close - prev.close) / prev.close) * 100,
      marketCap: null,
      volume: latest.volume,
      high24h: latest.high,
      low24h: latest.low,
      sparkline: existingStock.priceHistory.slice(-7).map(d => d.close),
      priceHistory: existingStock.priceHistory,
      image: null,
      rank: null,
    };
  }

  // Generate mock data for any asset not in existing mocks
  const mockData = getMockPriceData(asset.id, asset.category);
  return { ...mockData, rank: null };
}
