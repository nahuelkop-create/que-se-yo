// Servicio unificado de precios para cualquier tipo de activo
// Usa CoinGecko para crypto, Alpha Vantage para acciones/ETFs, mock para bonos/índices locales

import { mockCryptoData, mockStockData, getMockPriceData, getMockHistoryByPeriod } from '../data/mockData';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query';

// Period to CoinGecko days mapping
const PERIOD_TO_DAYS = { '1D': 1, '1W': 7, '1M': 30, '1Y': 365, 'MAX': 'max' };

/**
 * Fetch OHLCV history for a specific period
 * Returns lightweight-charts format: { time, open, high, low, close }[]
 */
export async function fetchAssetHistory(asset, period = '1M', settings = {}) {
  if (settings.useMock !== false) {
    return getMockHistoryByPeriod(asset.id, period, asset.category);
  }

  try {
    if (asset.source === 'coingecko') {
      return await fetchCoinGeckoOHLC(asset, period);
    }
    // For non-crypto, fall back to mock for now (AV free tier is limited)
    return getMockHistoryByPeriod(asset.id, period, asset.category);
  } catch (error) {
    console.warn(`Error obteniendo historial de ${asset.ticker}:`, error.message);
    return getMockHistoryByPeriod(asset.id, period, asset.category);
  }
}

async function fetchCoinGeckoOHLC(asset, period) {
  const days = PERIOD_TO_DAYS[period] || 30;
  const res = await fetch(
    `${COINGECKO_BASE}/coins/${asset.sourceId}/ohlc?vs_currency=usd&days=${days}`
  );
  if (!res.ok) throw new Error(`CoinGecko OHLC error: ${res.status}`);

  const data = await res.json();
  return data.map(([ts, open, high, low, close]) => ({
    time: period === '1D'
      ? Math.floor(ts / 1000)
      : new Date(ts).toISOString().split('T')[0],
    open, high, low, close,
  }));
}

/**
 * Fetch current price + basic data for an asset
 * Returns normalized: { price, change, changePercent, marketCap, volume, high24h, low24h, priceHistory }
 */
export async function fetchAssetPrice(asset, settings = {}) {
  if (settings.useMock !== false) {
    return getMockAssetPrice(asset);
  }

  try {
    if (asset.source === 'coingecko') {
      return await fetchCoinGeckoPrice(asset);
    } else if (asset.source === 'alphavantage' && settings.alphaVantageKey) {
      return await fetchAlphaVantagePrice(asset, settings.alphaVantageKey);
    } else {
      return getMockAssetPrice(asset);
    }
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

  // Also fetch history
  let priceHistory = [];
  try {
    const histRes = await fetch(
      `${COINGECKO_BASE}/coins/${asset.sourceId}/market_chart?vs_currency=usd&days=60`
    );
    if (histRes.ok) {
      const histData = await histRes.json();
      priceHistory = histData.prices.map(([ts, p]) => ({
        date: new Date(ts).toISOString().split('T')[0],
        price: parseFloat(p.toFixed(2)),
        close: parseFloat(p.toFixed(2)),
        open: parseFloat(p.toFixed(2)),
        high: parseFloat((p * 1.005).toFixed(2)),
        low: parseFloat((p * 0.995).toFixed(2)),
        volume: 0,
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
    };
  }

  // Generate mock data for any asset not in existing mocks
  const mockData = getMockPriceData(asset.id, asset.category);
  return mockData;
}
