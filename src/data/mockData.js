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
