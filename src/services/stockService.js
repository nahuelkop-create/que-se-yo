import { mockStockData } from '../data/mockData';

const ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query';

/**
 * Fetch stock data for all tracked symbols
 */
export async function fetchAllStocks(apiKey) {
  const symbols = ['AAPL', 'MSFT', 'GOOGL'];
  
  if (!apiKey) {
    console.info('Sin clave Alpha Vantage, usando datos de respaldo');
    return mockStockData;
  }
  
  try {
    const results = await Promise.all(
      symbols.map(symbol => fetchStockData(symbol, apiKey))
    );
    return results;
  } catch (error) {
    console.warn('Alpha Vantage no disponible, usando datos de respaldo:', error.message);
    return mockStockData;
  }
}

/**
 * Fetch daily time series for a single stock
 */
async function fetchStockData(symbol, apiKey) {
  try {
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
    
    const stockNames = {
      AAPL: 'Apple Inc.',
      MSFT: 'Microsoft Corp.',
      GOOGL: 'Alphabet Inc.',
    };
    
    return {
      symbol,
      name: stockNames[symbol] || symbol,
      priceHistory,
    };
  } catch (error) {
    console.warn(`Error fetching ${symbol}:`, error.message);
    const mock = mockStockData.find(s => s.symbol === symbol);
    return mock || { symbol, name: symbol, priceHistory: [] };
  }
}
