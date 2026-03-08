// Catálogo completo de activos financieros
// Incluye: Criptomonedas, Acciones, CEDEARs, Índices, ETFs, Bonos

export const ASSET_CATEGORIES = [
  { id: 'todos', label: 'Todos', icon: 'grid' },
  { id: 'crypto', label: 'Crypto', icon: 'bitcoin' },
  { id: 'acciones', label: 'Acciones', icon: 'line-chart' },
  { id: 'cedears', label: 'CEDEARs', icon: 'landmark' },
  { id: 'indices', label: 'Índices', icon: 'bar-chart' },
  { id: 'etfs', label: 'ETFs', icon: 'layers' },
  { id: 'bonos', label: 'Bonos', icon: 'shield' },
];

// category: tipo de activo
// source: 'coingecko' | 'alphavantage' — determina qué API usar
// sourceId: ID específico para la API (ej: 'bitcoin' para CoinGecko, 'AAPL' para AV)
// priceKey: campo de precio en mock data

const assetCatalog = [
  // ═══════════════════════════════════════════
  // CRIPTOMONEDAS
  // ═══════════════════════════════════════════
  { id: 'bitcoin', ticker: 'BTC', name: 'Bitcoin', category: 'crypto', source: 'coingecko', sourceId: 'bitcoin', description: 'La primera y más grande criptomoneda por capitalización de mercado. Creada en 2009 por Satoshi Nakamoto como dinero digital descentralizado.', sector: 'Criptomoneda', image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'ethereum', ticker: 'ETH', name: 'Ethereum', category: 'crypto', source: 'coingecko', sourceId: 'ethereum', description: 'Plataforma de contratos inteligentes líder. Su criptomoneda nativa, Ether, es la segunda más grande del mercado.', sector: 'Smart Contracts', image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'solana', ticker: 'SOL', name: 'Solana', category: 'crypto', source: 'coingecko', sourceId: 'solana', description: 'Blockchain de alta velocidad con transacciones rápidas y bajo costo. Popular para DeFi y NFTs.', sector: 'Layer 1', image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { id: 'binancecoin', ticker: 'BNB', name: 'BNB', category: 'crypto', source: 'coingecko', sourceId: 'binancecoin', description: 'Token nativo del ecosistema Binance, el exchange de criptomonedas más grande del mundo.', sector: 'Exchange', image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
  { id: 'ripple', ticker: 'XRP', name: 'XRP', category: 'crypto', source: 'coingecko', sourceId: 'ripple', description: 'Criptomoneda enfocada en pagos internacionales rápidos y de bajo costo para instituciones financieras.', sector: 'Pagos', image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
  { id: 'cardano', ticker: 'ADA', name: 'Cardano', category: 'crypto', source: 'coingecko', sourceId: 'cardano', description: 'Blockchain de tercera generación con enfoque en investigación académica y desarrollo sostenible.', sector: 'Smart Contracts', image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
  { id: 'avalanche', ticker: 'AVAX', name: 'Avalanche', category: 'crypto', source: 'coingecko', sourceId: 'avalanche-2', description: 'Plataforma de contratos inteligentes rápida y ecológica con subredes personalizables.', sector: 'Layer 1', image: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png' },
  { id: 'polkadot', ticker: 'DOT', name: 'Polkadot', category: 'crypto', source: 'coingecko', sourceId: 'polkadot', description: 'Protocolo multi-cadena que permite la interoperabilidad entre diferentes blockchains.', sector: 'Interoperabilidad', image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png' },
  { id: 'chainlink', ticker: 'LINK', name: 'Chainlink', category: 'crypto', source: 'coingecko', sourceId: 'chainlink', description: 'Red de oráculos descentralizados que conecta contratos inteligentes con datos del mundo real.', sector: 'Oráculos', image: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
  { id: 'dogecoin', ticker: 'DOGE', name: 'Dogecoin', category: 'crypto', source: 'coingecko', sourceId: 'dogecoin', description: 'Criptomoneda popular nacida como meme, con una comunidad activa y uso creciente en pagos.', sector: 'Meme', image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },

  // ═══════════════════════════════════════════
  // ACCIONES USA
  // ═══════════════════════════════════════════
  { id: 'aapl', ticker: 'AAPL', name: 'Apple Inc.', category: 'acciones', source: 'alphavantage', sourceId: 'AAPL', description: 'Gigante tecnológico fabricante del iPhone, Mac, iPad y servicios digitales. La empresa más valiosa del mundo.', sector: 'Tecnología' },
  { id: 'msft', ticker: 'MSFT', name: 'Microsoft Corp.', category: 'acciones', source: 'alphavantage', sourceId: 'MSFT', description: 'Líder en software empresarial, nube (Azure) e inteligencia artificial (Copilot, OpenAI).', sector: 'Tecnología' },
  { id: 'googl', ticker: 'GOOGL', name: 'Alphabet Inc.', category: 'acciones', source: 'alphavantage', sourceId: 'GOOGL', description: 'Empresa matriz de Google. Domina búsqueda web, publicidad digital, YouTube y cloud computing.', sector: 'Tecnología' },
  { id: 'amzn', ticker: 'AMZN', name: 'Amazon.com', category: 'acciones', source: 'alphavantage', sourceId: 'AMZN', description: 'Líder mundial en comercio electrónico y servicios de nube (AWS). También en streaming y logística.', sector: 'Consumo / Tech' },
  { id: 'nvda', ticker: 'NVDA', name: 'NVIDIA Corp.', category: 'acciones', source: 'alphavantage', sourceId: 'NVDA', description: 'Fabricante de GPUs líder, pieza clave en inteligencia artificial, gaming y centros de datos.', sector: 'Semiconductores' },
  { id: 'tsla', ticker: 'TSLA', name: 'Tesla Inc.', category: 'acciones', source: 'alphavantage', sourceId: 'TSLA', description: 'Líder en vehículos eléctricos, energía solar y almacenamiento de energía. Fundada por Elon Musk.', sector: 'Automotriz / Energía' },
  { id: 'meta', ticker: 'META', name: 'Meta Platforms', category: 'acciones', source: 'alphavantage', sourceId: 'META', description: 'Empresa matriz de Facebook, Instagram y WhatsApp. Invierte fuertemente en realidad virtual (Quest).', sector: 'Tecnología / Social' },
  { id: 'jpm', ticker: 'JPM', name: 'JPMorgan Chase', category: 'acciones', source: 'alphavantage', sourceId: 'JPM', description: 'El banco más grande de Estados Unidos. Líder en banca de inversión, gestión de activos y banca comercial.', sector: 'Financiero' },
  { id: 'v', ticker: 'V', name: 'Visa Inc.', category: 'acciones', source: 'alphavantage', sourceId: 'V', description: 'Red de pagos global que procesa miles de millones de transacciones al año en más de 200 países.', sector: 'Financiero / Pagos' },
  { id: 'ko', ticker: 'KO', name: 'Coca-Cola Co.', category: 'acciones', source: 'alphavantage', sourceId: 'KO', description: 'Gigante de bebidas con más de 200 marcas. Empresa icónica con décadas de dividendos estables.', sector: 'Consumo Básico' },

  // ═══════════════════════════════════════════
  // CEDEARs (Certificados de Depósito Argentinos)
  // ═══════════════════════════════════════════
  { id: 'cedear-aapl', ticker: 'AAPL.BA', name: 'Apple (CEDEAR)', category: 'cedears', source: 'alphavantage', sourceId: 'AAPL', description: 'CEDEAR de Apple. Permite invertir en Apple desde Argentina en pesos, con cobertura de tipo de cambio implícita.', sector: 'Tecnología', ratio: '1:20' },
  { id: 'cedear-msft', ticker: 'MSFT.BA', name: 'Microsoft (CEDEAR)', category: 'cedears', source: 'alphavantage', sourceId: 'MSFT', description: 'CEDEAR de Microsoft. Acceso al gigante del software, la nube y la IA desde el mercado argentino.', sector: 'Tecnología', ratio: '1:10' },
  { id: 'cedear-googl', ticker: 'GOOGL.BA', name: 'Alphabet (CEDEAR)', category: 'cedears', source: 'alphavantage', sourceId: 'GOOGL', description: 'CEDEAR de Alphabet/Google. Exposición al líder en búsquedas, publicidad y servicios cloud.', sector: 'Tecnología', ratio: '1:13' },
  { id: 'cedear-meli', ticker: 'MELI.BA', name: 'MercadoLibre (CEDEAR)', category: 'cedears', source: 'alphavantage', sourceId: 'MELI', description: 'CEDEAR de MercadoLibre. El e-commerce y fintech más grande de Latinoamérica, empresa argentina.', sector: 'E-commerce / Fintech', ratio: '1:6' },
  { id: 'cedear-tsla', ticker: 'TSLA.BA', name: 'Tesla (CEDEAR)', category: 'cedears', source: 'alphavantage', sourceId: 'TSLA', description: 'CEDEAR de Tesla. Invertir en vehículos eléctricos y energía limpia desde Argentina.', sector: 'Automotriz / Energía', ratio: '1:15' },
  { id: 'cedear-nvda', ticker: 'NVDA.BA', name: 'NVIDIA (CEDEAR)', category: 'cedears', source: 'alphavantage', sourceId: 'NVDA', description: 'CEDEAR de NVIDIA. Exposición al boom de IA y GPUs desde el mercado local.', sector: 'Semiconductores', ratio: '1:10' },
  { id: 'cedear-amzn', ticker: 'AMZN.BA', name: 'Amazon (CEDEAR)', category: 'cedears', source: 'alphavantage', sourceId: 'AMZN', description: 'CEDEAR de Amazon. Acceso al líder mundial en e-commerce y cloud desde Argentina.', sector: 'Consumo / Tech', ratio: '1:36' },
  { id: 'cedear-ko', ticker: 'KO.BA', name: 'Coca-Cola (CEDEAR)', category: 'cedears', source: 'alphavantage', sourceId: 'KO', description: 'CEDEAR de Coca-Cola. Inversión defensiva con dividendos estables desde el mercado argentino.', sector: 'Consumo Básico', ratio: '1:5' },

  // ═══════════════════════════════════════════
  // ÍNDICES
  // ═══════════════════════════════════════════
  { id: 'sp500', ticker: 'SPY', name: 'S&P 500', category: 'indices', source: 'alphavantage', sourceId: 'SPY', description: 'Índice de las 500 empresas más grandes de EE.UU. El benchmark más seguido del mundo para medir el mercado.', sector: 'Índice USA' },
  { id: 'nasdaq', ticker: 'QQQ', name: 'Nasdaq 100', category: 'indices', source: 'alphavantage', sourceId: 'QQQ', description: 'Índice de las 100 empresas no financieras más grandes del Nasdaq. Fuerte concentración en tecnología.', sector: 'Índice Tech' },
  { id: 'dowjones', ticker: 'DIA', name: 'Dow Jones', category: 'indices', source: 'alphavantage', sourceId: 'DIA', description: 'Índice industrial de 30 grandes empresas de EE.UU. Uno de los índices más antiguos y seguidos del mundo.', sector: 'Índice USA' },
  { id: 'merval', ticker: 'MERVAL', name: 'S&P Merval', category: 'indices', source: 'mock', sourceId: 'MERVAL', description: 'Principal índice bursátil de Argentina. Refleja el comportamiento de las acciones más líquidas de la Bolsa de Buenos Aires.', sector: 'Índice Argentina' },
  { id: 'ibovespa', ticker: 'IBOV', name: 'Ibovespa', category: 'indices', source: 'mock', sourceId: 'IBOV', description: 'Principal índice de la bolsa de Brasil (B3). Incluye las acciones más negociadas del mercado brasileño.', sector: 'Índice Brasil' },

  // ═══════════════════════════════════════════
  // ETFs
  // ═══════════════════════════════════════════
  { id: 'voo', ticker: 'VOO', name: 'Vanguard S&P 500', category: 'etfs', source: 'alphavantage', sourceId: 'VOO', description: 'ETF que replica el S&P 500 de Vanguard. Bajo costo y amplia diversificación en las 500 mayores empresas de EE.UU.', sector: 'Renta Variable USA' },
  { id: 'vti', ticker: 'VTI', name: 'Vanguard Total Market', category: 'etfs', source: 'alphavantage', sourceId: 'VTI', description: 'ETF que cubre todo el mercado de acciones de EE.UU., incluyendo small, mid y large caps.', sector: 'Renta Variable USA' },
  { id: 'vxus', ticker: 'VXUS', name: 'Vanguard Intl.', category: 'etfs', source: 'alphavantage', sourceId: 'VXUS', description: 'ETF de acciones internacionales (fuera de EE.UU.). Diversificación global en mercados desarrollados y emergentes.', sector: 'Renta Variable Intl.' },
  { id: 'arkk', ticker: 'ARKK', name: 'ARK Innovation', category: 'etfs', source: 'alphavantage', sourceId: 'ARKK', description: 'ETF de innovación disruptiva gestionado por Cathie Wood. Invierte en IA, genómica, fintech y robótica.', sector: 'Innovación' },
  { id: 'gld', ticker: 'GLD', name: 'SPDR Gold Shares', category: 'etfs', source: 'alphavantage', sourceId: 'GLD', description: 'ETF que sigue el precio del oro. Refugio clásico en tiempos de incertidumbre y cobertura contra inflación.', sector: 'Commodities / Oro' },
  { id: 'tlt', ticker: 'TLT', name: 'iShares 20+ Yr Treasury', category: 'etfs', source: 'alphavantage', sourceId: 'TLT', description: 'ETF de bonos del Tesoro de EE.UU. a largo plazo. Sensible a cambios en tasas de interés.', sector: 'Renta Fija USA' },
  { id: 'eem', ticker: 'EEM', name: 'iShares Emerging Markets', category: 'etfs', source: 'alphavantage', sourceId: 'EEM', description: 'ETF de mercados emergentes. Exposición a China, India, Brasil, Taiwán y otros mercados en desarrollo.', sector: 'Mercados Emergentes' },

  // ═══════════════════════════════════════════
  // BONOS
  // ═══════════════════════════════════════════
  { id: 'us10y', ticker: 'US10Y', name: 'Bono EE.UU. 10 años', category: 'bonos', source: 'mock', sourceId: 'US10Y', description: 'Rendimiento del bono del Tesoro de EE.UU. a 10 años. La tasa de referencia más importante del mundo para deuda soberana y crédito.', sector: 'Renta Fija USA', isBond: true },
  { id: 'us2y', ticker: 'US2Y', name: 'Bono EE.UU. 2 años', category: 'bonos', source: 'mock', sourceId: 'US2Y', description: 'Rendimiento del bono del Tesoro a 2 años. Muy sensible a decisiones de la Fed sobre tasas de interés.', sector: 'Renta Fija USA', isBond: true },
  { id: 'al30', ticker: 'AL30', name: 'Bono Argentina AL30', category: 'bonos', source: 'mock', sourceId: 'AL30', description: 'Bono soberano argentino en dólares con vencimiento 2030. Uno de los bonos más negociados del mercado local.', sector: 'Renta Fija Argentina', isBond: true },
  { id: 'gd30', ticker: 'GD30', name: 'Bono Argentina GD30', category: 'bonos', source: 'mock', sourceId: 'GD30', description: 'Bono global argentino en dólares 2030. Emitido bajo legislación de Nueva York, mayor protección legal.', sector: 'Renta Fija Argentina', isBond: true },
  { id: 'gd35', ticker: 'GD35', name: 'Bono Argentina GD35', category: 'bonos', source: 'mock', sourceId: 'GD35', description: 'Bono global argentino con vencimiento 2035. Mayor duración, más sensible a cambios en riesgo país.', sector: 'Renta Fija Argentina', isBond: true },
];

export default assetCatalog;

/**
 * Get all unique categories
 */
export function getCategories() {
  return ASSET_CATEGORIES;
}

/**
 * Filter and search assets
 */
export function searchAssets(query = '', category = 'todos') {
  let results = assetCatalog;

  if (category !== 'todos') {
    results = results.filter(a => a.category === category);
  }

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.ticker.toLowerCase().includes(q) ||
      a.sector?.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q)
    );
  }

  return results;
}

/**
 * Get asset by ID
 */
export function getAssetById(id) {
  return assetCatalog.find(a => a.id === id) || null;
}

/**
 * Get assets by category
 */
export function getAssetsByCategory(category) {
  return assetCatalog.filter(a => a.category === category);
}
