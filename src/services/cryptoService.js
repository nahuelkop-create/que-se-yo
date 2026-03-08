import { mockCryptoData } from '../data/mockData';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

/**
 * Fetch top crypto market data from CoinGecko
 * CoinGecko es gratuita — siempre intentamos datos reales
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
 * Returns daily candle data with volume
 */
export async function fetchCryptoHistory(id, days = 30) {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!res.ok) throw new Error(`History API error: ${res.status}`);
    
    const data = await res.json();
    const prices = data.prices || [];
    const volumes = data.total_volumes || [];

    // Group by day for proper OHLCV data
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

    return Object.entries(dayMap).map(([date, { prices: ps, volumes: vs }]) => ({
      date,
      price: parseFloat(ps[ps.length - 1].toFixed(2)),
      open: parseFloat(ps[0].toFixed(2)),
      high: parseFloat(Math.max(...ps).toFixed(2)),
      low: parseFloat(Math.min(...ps).toFixed(2)),
      close: parseFloat(ps[ps.length - 1].toFixed(2)),
      volume: vs.length > 0 ? Math.round(vs.reduce((a, b) => a + b, 0) / vs.length) : 0,
    }));
  } catch {
    // Return mock history for this coin
    const mock = mockCryptoData.find(c => c.id === id);
    return mock?.priceHistory || [];
  }
}
