// Servicio unificado de precios para cualquier tipo de activo
// Cada respuesta incluye dataQuality para transparencia total
// NO devuelve mock silencioso — si falla, retorna estado honesto

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query';

// Period to CoinGecko days mapping
const PERIOD_TO_DAYS = { '1D': 1, '1W': 7, '1M': 30, '1Y': 365, 'MAX': 'max' };

// ═══════════════════════════════════════════
// DATA QUALITY — formato uniforme
// ═══════════════════════════════════════════

/**
 * Crea un objeto dataQuality estándar.
 * @param {boolean} isReal - ¿dato de fuente real?
 * @param {string} source - 'CoinGecko' | 'AlphaVantage' | 'GNews' | 'mock'
 * @param {string} freshness - 'fresh' | 'stale' | 'unknown'
 * @param {string} [reason] - razón legible en español
 */
function makeDataQuality(isReal, source, freshness, reason = '') {
  return {
    isReal,
    source,
    lastUpdated: new Date().toISOString(),
    freshness,
    reason,
  };
}

/**
 * Evalúa la frescura de datos basándose en el timestamp.
 * Crypto: frescos si < 2h, stale si > 24h
 * Acciones/ETFs: frescos si dentro del último día hábil, stale si > 3 días
 */
function evaluateFreshness(dataTimestamp, assetCategory) {
  if (!dataTimestamp) return 'unknown';

  const now = new Date();
  const dataDate = new Date(dataTimestamp);
  const diffHours = (now - dataDate) / (1000 * 60 * 60);

  if (assetCategory === 'crypto') {
    if (diffHours <= 2) return 'fresh';
    if (diffHours <= 24) return 'fresh'; // Crypto CoinGecko siempre es reciente
    return 'stale';
  }

  // Acciones, ETFs, índices, CEDEARs
  if (diffHours <= 48) return 'fresh'; // Últimas 48h hábiles
  if (diffHours <= 96) return 'stale';
  return 'unknown';
}


// ═══════════════════════════════════════════
// FETCH OHLCV HISTORY
// ═══════════════════════════════════════════

/**
 * Fetch OHLCV history for a specific period.
 * Returns: { data: [...candles], dataQuality: {...} }
 */
export async function fetchAssetHistory(asset, period = '1M', settings = {}) {
  try {
    if (asset.source === 'coingecko') {
      const data = await fetchCoinGeckoOHLC(asset, period);
      return {
        data,
        dataQuality: makeDataQuality(true, 'CoinGecko', 'fresh', `Velas de CoinGecko (${period})`),
      };
    }
    if (asset.source === 'alphavantage' && settings.alphaVantageKey) {
      const data = await fetchAlphaVantageHistory(asset, period, settings.alphaVantageKey);
      return {
        data,
        dataQuality: makeDataQuality(true, 'AlphaVantage', 'fresh', `Historial de Alpha Vantage (${period})`),
      };
    }
    // No hay fuente disponible
    return {
      data: null,
      dataQuality: makeDataQuality(
        false,
        asset.source === 'alphavantage' ? 'AlphaVantage' : 'mock',
        'unknown',
        asset.source === 'alphavantage'
          ? 'Se necesita API key de Alpha Vantage para historial.'
          : 'No hay fuente de historial disponible para este activo.'
      ),
    };
  } catch (error) {
    console.warn(`Error obteniendo historial de ${asset.ticker}:`, error.message);
    return {
      data: null,
      dataQuality: makeDataQuality(
        false,
        asset.source === 'coingecko' ? 'CoinGecko' : 'AlphaVantage',
        'unknown',
        `Error: ${error.message}`
      ),
    };
  }
}

/**
 * Fetch OHLC data from CoinGecko + volume from market_chart
 */
async function fetchCoinGeckoOHLC(asset, period) {
  const days = PERIOD_TO_DAYS[period] || 30;

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
          const key = Math.round(ts / 3600000) * 3600000;
          volumeMap[key] = vol;
        }
      }
    }
  } catch { /* volume is optional */ }

  return ohlcData.map(([ts, open, high, low, close]) => {
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


// ═══════════════════════════════════════════
// FETCH CURRENT PRICE
// ═══════════════════════════════════════════

/**
 * Fetch current price + basic data for an asset.
 * SIEMPRE incluye dataQuality. NO cae a mock silenciosamente.
 */
export async function fetchAssetPrice(asset, settings = {}) {
  try {
    if (asset.source === 'coingecko') {
      return await fetchCoinGeckoPrice(asset);
    }
    if (asset.source === 'alphavantage' && settings.alphaVantageKey) {
      return await fetchAlphaVantagePrice(asset, settings.alphaVantageKey);
    }

    // No hay fuente disponible — retornar estado honesto, NO mock
    return makeNoDataResponse(asset);
  } catch (error) {
    console.warn(`Error obteniendo precio de ${asset.ticker}:`, error.message);
    return makeErrorResponse(asset, error.message);
  }
}

/**
 * Respuesta para cuando no hay fuente de datos (sin key, fuente mock, etc.)
 */
function makeNoDataResponse(asset) {
  const reason = asset.source === 'alphavantage'
    ? 'Configurá tu API key de Alpha Vantage en ⚙️ Configuración.'
    : 'No hay fuente de datos disponible para este activo.';

  return {
    price: null,
    change: null,
    changePercent: null,
    marketCap: null,
    volume: null,
    high24h: null,
    low24h: null,
    sparkline: [],
    priceHistory: [],
    image: asset.image || null,
    rank: null,
    dataQuality: makeDataQuality(false, asset.source || 'mock', 'unknown', reason),
  };
}

/**
 * Respuesta para cuando la fuente falla
 */
function makeErrorResponse(asset, errorMessage) {
  const sourceName = asset.source === 'coingecko' ? 'CoinGecko' : 'AlphaVantage';
  return {
    price: null,
    change: null,
    changePercent: null,
    marketCap: null,
    volume: null,
    high24h: null,
    low24h: null,
    sparkline: [],
    priceHistory: [],
    image: asset.image || null,
    rank: null,
    dataQuality: makeDataQuality(false, sourceName, 'unknown', `Error al obtener datos: ${errorMessage}`),
  };
}


// ═══════════════════════════════════════════
// COINGECKO PRICE
// ═══════════════════════════════════════════

async function fetchCoinGeckoPrice(asset) {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/${asset.sourceId}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true`
  );
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);

  const data = await res.json();
  const md = data.market_data;

  // Fetch history for analysis
  let priceHistory = [];
  try {
    const histRes = await fetch(
      `${COINGECKO_BASE}/coins/${asset.sourceId}/market_chart?vs_currency=usd&days=60`
    );
    if (histRes.ok) {
      const histData = await histRes.json();
      const prices = histData.prices || [];
      const volumes = histData.total_volumes || [];

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

  const freshness = evaluateFreshness(md.last_updated, 'crypto');

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
    dataQuality: makeDataQuality(true, 'CoinGecko', freshness, `Precio en tiempo real de CoinGecko.`),
  };
}


// ═══════════════════════════════════════════
// ALPHA VANTAGE PRICE
// ═══════════════════════════════════════════

async function fetchAlphaVantagePrice(asset, apiKey) {
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
  let lastDataDate = gq['07. latest trading day'] || null;
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

  const freshness = evaluateFreshness(lastDataDate, asset.category);

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
    dataQuality: makeDataQuality(true, 'AlphaVantage', freshness, `Datos de Alpha Vantage (${lastDataDate || 'reciente'}).`),
  };
}
