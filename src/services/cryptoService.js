import { mockCryptoData } from '../data/mockData';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

/**
 * Fetch top crypto market data from CoinGecko
 */
export async function fetchCryptoData() {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&sparkline=true&price_change_percentage=24h`
    );
    
    if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);
    
    const data = await res.json();
    
    // Enrich with price history
    const enriched = await Promise.all(
      data.map(async (coin) => {
        const history = await fetchCryptoHistory(coin.id, 30);
        return {
          ...coin,
          symbol: coin.symbol.toUpperCase(),
          priceHistory: history,
        };
      })
    );
    
    return enriched;
  } catch (error) {
    console.warn('CoinGecko no disponible, usando datos de respaldo:', error.message);
    return mockCryptoData;
  }
}

/**
 * Fetch price history for a crypto asset
 */
export async function fetchCryptoHistory(id, days = 30) {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!res.ok) throw new Error(`History API error: ${res.status}`);
    
    const data = await res.json();
    
    return data.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      close: parseFloat(price.toFixed(2)),
    }));
  } catch {
    // Return mock history for this coin
    const mock = mockCryptoData.find(c => c.id === id);
    return mock?.priceHistory || [];
  }
}
