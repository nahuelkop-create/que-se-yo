// Servicio de acciones — Alpha Vantage API
// NO cae a mock silencioso. Si falta key o falla API, retorna estado honesto.

const ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query';

/**
 * Fetch stock data for tracked symbols.
 * Cada stock retornado incluye dataQuality.
 */
export async function fetchAllStocks(apiKey) {
  const symbols = ['AAPL', 'MSFT', 'GOOGL'];

  if (!apiKey) {
    // Sin key — NO usamos mock. Retornamos estado honesto.
    return symbols.map(symbol => ({
      symbol,
      name: stockNames[symbol] || symbol,
      priceHistory: [],
      dataQuality: {
        isReal: false,
        source: 'AlphaVantage',
        lastUpdated: new Date().toISOString(),
        freshness: 'unknown',
        reason: 'Configurá tu API key de Alpha Vantage en ⚙️ Configuración para ver datos reales.',
      },
    }));
  }

  const results = await Promise.allSettled(
    symbols.map(symbol => fetchStockData(symbol, apiKey))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') return result.value;

    const symbol = symbols[index];
    return {
      symbol,
      name: stockNames[symbol] || symbol,
      priceHistory: [],
      dataQuality: {
        isReal: false,
        source: 'AlphaVantage',
        lastUpdated: new Date().toISOString(),
        freshness: 'unknown',
        reason: `Error: ${result.reason?.message || 'No se pudieron obtener datos.'}`,
      },
    };
  });
}

const stockNames = {
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corp.',
  GOOGL: 'Alphabet Inc.',
};

/**
 * Fetch daily time series for a single stock
 */
async function fetchStockData(symbol, apiKey) {
  const res = await fetch(
    `${ALPHA_VANTAGE_BASE}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${apiKey}`
  );

  if (!res.ok) throw new Error(`Alpha Vantage error: ${res.status}`);

  const data = await res.json();
  const timeSeries = data['Time Series (Daily)'];

  if (!timeSeries) {
    throw new Error(data.Note || data.Information || 'No data returned');
  }

  const priceHistory = Object.entries(timeSeries)
    .slice(0, 60)
    .reverse()
    .map(([date, values]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
      price: parseFloat(values['4. close']),
    }));

  const lastDate = priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].date : null;

  return {
    symbol,
    name: stockNames[symbol] || symbol,
    priceHistory,
    dataQuality: {
      isReal: true,
      source: 'AlphaVantage',
      lastUpdated: new Date().toISOString(),
      freshness: 'fresh',
      reason: `Datos de Alpha Vantage (último: ${lastDate || 'reciente'}).`,
    },
  };
}
