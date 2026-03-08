// Mock data for immediate functionality without API keys
// Datos de respaldo para funcionar sin claves API

const generatePriceHistory = (basePrice, days, volatility = 0.03) => {
  const data = [];
  let price = basePrice * (1 - volatility * days * 0.1);
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price * 0.5, price + change);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      open: parseFloat((price * (1 - Math.random() * 0.01)).toFixed(2)),
      high: parseFloat((price * (1 + Math.random() * 0.02)).toFixed(2)),
      low: parseFloat((price * (1 - Math.random() * 0.02)).toFixed(2)),
      close: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    });
  }
  return data;
};

export const mockCryptoData = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    current_price: 67432.18,
    price_change_percentage_24h: 2.34,
    market_cap: 1324000000000,
    total_volume: 28500000000,
    sparkline_in_7d: { price: generatePriceHistory(67000, 7, 0.02).map(d => d.price) },
    priceHistory: generatePriceHistory(67000, 30, 0.025),
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    current_price: 3521.45,
    price_change_percentage_24h: -1.12,
    market_cap: 423000000000,
    total_volume: 14200000000,
    sparkline_in_7d: { price: generatePriceHistory(3500, 7, 0.025).map(d => d.price) },
    priceHistory: generatePriceHistory(3500, 30, 0.03),
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    current_price: 178.62,
    price_change_percentage_24h: 5.67,
    market_cap: 82000000000,
    total_volume: 3800000000,
    sparkline_in_7d: { price: generatePriceHistory(175, 7, 0.04).map(d => d.price) },
    priceHistory: generatePriceHistory(175, 30, 0.04),
  },
];

export const mockStockData = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    priceHistory: generatePriceHistory(195, 60, 0.015),
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    priceHistory: generatePriceHistory(420, 60, 0.012),
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    priceHistory: generatePriceHistory(155, 60, 0.018),
  },
];

export const mockNews = [
  {
    title: 'Bitcoin supera los $67,000 mientras el mercado muestra señales alcistas',
    description: 'La criptomoneda líder continúa su tendencia alcista impulsada por la adopción institucional y las expectativas de ETF.',
    source: { name: 'CriptoNoticias' },
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    image: null,
    url: '#',
  },
  {
    title: 'Apple reporta ganancias récord en el último trimestre fiscal',
    description: 'Las ventas del iPhone y los servicios digitales impulsan los resultados financieros de la compañía de Cupertino.',
    source: { name: 'Finanzas Digital' },
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    image: null,
    url: '#',
  },
  {
    title: 'Ethereum se prepara para una actualización importante de su red',
    description: 'La próxima actualización promete mejorar la escalabilidad y reducir las tarifas de transacción en la red.',
    source: { name: 'Blockchain Hoy' },
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    image: null,
    url: '#',
  },
  {
    title: 'La Fed mantiene las tasas de interés sin cambios',
    description: 'El banco central de Estados Unidos decidió mantener las tasas estables, afectando los mercados globales.',
    source: { name: 'Economía Latina' },
    publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    image: null,
    url: '#',
  },
  {
    title: 'Solana alcanza récord de transacciones diarias en su red',
    description: 'La blockchain de Solana procesó más de 65 millones de transacciones, estableciendo un nuevo récord.',
    source: { name: 'Tech Finanzas' },
    publishedAt: new Date(Date.now() - 15 * 3600000).toISOString(),
    image: null,
    url: '#',
  },
  {
    title: 'Microsoft anuncia nueva integración de IA en sus productos empresariales',
    description: 'La compañía expande Copilot a más servicios, impactando positivamente sus perspectivas en el mercado.',
    source: { name: 'Digital Business' },
    publishedAt: new Date(Date.now() - 20 * 3600000).toISOString(),
    image: null,
    url: '#',
  },
  {
    title: 'El mercado de NFTs muestra signos de recuperación en 2025',
    description: 'Después de una caída prolongada, los volúmenes de negociación de NFTs comienzan a crecer nuevamente.',
    source: { name: 'CriptoNoticias' },
    publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    image: null,
    url: '#',
  },
  {
    title: 'Inversores institucionales aumentan su exposición a criptomonedas',
    description: 'Grandes fondos de inversión están incrementando sus posiciones en Bitcoin y Ethereum como cobertura.',
    source: { name: 'Mercados Global' },
    publishedAt: new Date(Date.now() - 30 * 3600000).toISOString(),
    image: null,
    url: '#',
  },
];

// ═══════════════════════════════════════════
// Generador de datos mock para cualquier activo del catálogo
// ═══════════════════════════════════════════

const MOCK_BASE_PRICES = {
  // Crypto
  bitcoin: 67432, ethereum: 3521, solana: 178, binancecoin: 612, ripple: 0.62,
  cardano: 0.45, 'avalanche-2': 38, polkadot: 7.2, chainlink: 18.5, dogecoin: 0.16,
  // Acciones
  aapl: 195, msft: 420, googl: 155, amzn: 185, nvda: 880, tsla: 245, meta: 505, jpm: 198, v: 280, ko: 62,
  // CEDEARs (precio en pesos aprox / ratio)
  'cedear-aapl': 9750, 'cedear-msft': 42000, 'cedear-googl': 11500, 'cedear-meli': 280000,
  'cedear-tsla': 16300, 'cedear-nvda': 88000, 'cedear-amzn': 5100, 'cedear-ko': 12400,
  // Índices (via ETF proxy)
  sp500: 527, nasdaq: 455, dowjones: 395, merval: 1850000, ibovespa: 128000,
  // ETFs
  voo: 485, vti: 268, vxus: 58, arkk: 52, gld: 215, tlt: 92, eem: 42,
  // Bonos (rendimiento)
  us10y: 4.25, us2y: 4.68, al30: 62.5, gd30: 58.3, gd35: 45.2,
};

const MOCK_VOLATILITY = {
  crypto: 0.035,
  acciones: 0.015,
  cedears: 0.02,
  indices: 0.01,
  etfs: 0.012,
  bonos: 0.008,
};

/**
 * Generate mock price data for any asset
 */
export function getMockPriceData(assetId, category = 'acciones') {
  const basePrice = MOCK_BASE_PRICES[assetId] || 100;
  const volatility = MOCK_VOLATILITY[category] || 0.015;
  const priceHistory = generatePriceHistory(basePrice, 60, volatility);
  const latest = priceHistory[priceHistory.length - 1];
  const prev = priceHistory[priceHistory.length - 2];

  const change = latest.close - prev.close;
  const changePercent = (change / prev.close) * 100;

  // Market caps for crypto
  const marketCaps = {
    bitcoin: 1324e9, ethereum: 423e9, solana: 82e9, binancecoin: 92e9,
    ripple: 34e9, cardano: 16e9, 'avalanche-2': 14e9, polkadot: 9e9,
    chainlink: 11e9, dogecoin: 23e9,
  };

  return {
    price: latest.close,
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    marketCap: marketCaps[assetId] || null,
    volume: latest.volume,
    high24h: latest.high,
    low24h: latest.low,
    sparkline: priceHistory.slice(-7).map(d => d.close),
    priceHistory,
    image: null,
  };
}

// ═══════════════════════════════════════════
// Generador de OHLCV por período (para gráfico de velas)
// ═══════════════════════════════════════════

/**
 * Generate OHLCV data formatted for lightweight-charts by period
 * Returns: { time, open, high, low, close, volume }[]
 */
function generateOHLCVByPeriod(basePrice, period, volatility = 0.015) {
  const data = [];
  let price = basePrice;
  const now = new Date();

  // Period config: { bars, intervalMs, volMult }
  const config = {
    '1D': { bars: 78, intervalMs: 5 * 60 * 1000, volMult: 0.3 },        // 5min bars, ~6.5h trading
    '1W': { bars: 120, intervalMs: 60 * 60 * 1000, volMult: 0.5 },      // 1h bars
    '1M': { bars: 30, intervalMs: 24 * 60 * 60 * 1000, volMult: 1 },    // daily bars
    '1Y': { bars: 252, intervalMs: 24 * 60 * 60 * 1000, volMult: 1 },   // daily bars
    'MAX': { bars: 260, intervalMs: 7 * 24 * 60 * 60 * 1000, volMult: 2 }, // weekly bars
  };

  const { bars, intervalMs, volMult } = config[period] || config['1M'];
  const vol = volatility * volMult;

  // Start price slightly varied
  price = basePrice * (0.85 + Math.random() * 0.15);

  for (let i = bars; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * intervalMs);

    // Random OHLC with realistic wicks
    const change = (Math.random() - 0.48) * vol * price;
    const open = price;
    price = Math.max(price * 0.5, price + change);
    const close = price;
    const isUp = close >= open;
    const wickUp = Math.random() * vol * 0.5 * price;
    const wickDown = Math.random() * vol * 0.5 * price;
    const high = Math.max(open, close) + wickUp;
    const low = Math.min(open, close) - wickDown;

    // Format time for lightweight-charts
    let time;
    if (period === '1D') {
      // Use unix timestamp for intraday
      time = Math.floor(timestamp.getTime() / 1000);
    } else {
      // Use YYYY-MM-DD string for daily+
      time = timestamp.toISOString().split('T')[0];
    }

    data.push({
      time,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(Math.max(0.01, low).toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 500000,
    });
  }

  return data;
}

/**
 * Get mock OHLCV history for any asset + period
 */
export function getMockHistoryByPeriod(assetId, period = '1M', category = 'acciones') {
  const basePrice = MOCK_BASE_PRICES[assetId] || 100;
  const volatility = MOCK_VOLATILITY[category] || 0.015;
  return generateOHLCVByPeriod(basePrice, period, volatility);
}
