// Catálogo extendido de noticias mock con categorías, tickers e impacto
// Diseñado para filtrado por activo y por categoría

const now = Date.now();
const h = 3600000; // 1 hora en ms

export const mockNewsData = [
  // ═══════════════════════════════════════════
  // CRYPTO
  // ═══════════════════════════════════════════
  {
    title: 'Bitcoin supera los $67,000 mientras el mercado muestra señales alcistas',
    description: 'La criptomoneda líder continúa su tendencia alcista impulsada por la adopción institucional y las expectativas de ETF spot.',
    source: { name: 'CriptoNoticias' },
    publishedAt: new Date(now - 2 * h).toISOString(),
    category: 'crypto',
    tickers: ['BTC'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Ethereum se prepara para una actualización importante de su red',
    description: 'La próxima actualización promete mejorar la escalabilidad y reducir las tarifas de transacción significativamente.',
    source: { name: 'Blockchain Hoy' },
    publishedAt: new Date(now - 4 * h).toISOString(),
    category: 'crypto',
    tickers: ['ETH'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Solana alcanza récord de transacciones diarias en su red',
    description: 'La blockchain procesó más de 65 millones de transacciones, consolidándose como red de alta velocidad.',
    source: { name: 'Tech Finanzas' },
    publishedAt: new Date(now - 6 * h).toISOString(),
    category: 'crypto',
    tickers: ['SOL'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'SEC posterga decisión sobre ETF de Ethereum al segundo trimestre',
    description: 'El regulador solicitó más tiempo para evaluar las aplicaciones de ETF spot de Ethereum.',
    source: { name: 'Regulación Crypto' },
    publishedAt: new Date(now - 8 * h).toISOString(),
    category: 'crypto',
    tickers: ['ETH'],
    impact: 'bajista',
    url: '#',
  },
  {
    title: 'Binance reporta aumento del 40% en volumen de trading mensual',
    description: 'El exchange líder mundial ve un resurgimiento del interés institucional y minorista.',
    source: { name: 'CriptoNoticias' },
    publishedAt: new Date(now - 10 * h).toISOString(),
    category: 'crypto',
    tickers: ['BNB'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Cardano lanza nueva fase de gobernanza descentralizada',
    description: 'La comunidad de ADA ahora puede votar propuestas de mejora directamente en la cadena.',
    source: { name: 'Blockchain Hoy' },
    publishedAt: new Date(now - 12 * h).toISOString(),
    category: 'crypto',
    tickers: ['ADA'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'XRP gana terreno en pagos internacionales tras acuerdo con bancos asiáticos',
    description: 'Ripple expande su red de pagos con nuevas integraciones bancarias en Japón y Corea del Sur.',
    source: { name: 'Finanzas Digital' },
    publishedAt: new Date(now - 14 * h).toISOString(),
    category: 'crypto',
    tickers: ['XRP'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Hackeo a protocolo DeFi en Avalanche genera pérdidas de $15M',
    description: 'Un exploit en un contrato inteligente permitió drenar fondos de usuarios. El equipo trabaja en recuperación.',
    source: { name: 'Seguridad Crypto' },
    publishedAt: new Date(now - 17 * h).toISOString(),
    category: 'crypto',
    tickers: ['AVAX'],
    impact: 'bajista',
    url: '#',
  },
  {
    title: 'Dogecoin sube 12% tras rumores de integración en plataforma X',
    description: 'Especulaciones sobre pagos con DOGE en la plataforma de Elon Musk impulsan el precio.',
    source: { name: 'CriptoNoticias' },
    publishedAt: new Date(now - 20 * h).toISOString(),
    category: 'crypto',
    tickers: ['DOGE'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Chainlink expande oráculos a redes de capa 2 de Ethereum',
    description: 'LINK amplía su cobertura con feeds de precios en Arbitrum, Optimism y Base.',
    source: { name: 'Tech Finanzas' },
    publishedAt: new Date(now - 22 * h).toISOString(),
    category: 'crypto',
    tickers: ['LINK'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Inversores institucionales aumentan exposición a criptomonedas',
    description: 'Grandes fondos incrementan posiciones en Bitcoin y Ethereum como cobertura ante la inflación.',
    source: { name: 'Mercados Global' },
    publishedAt: new Date(now - 24 * h).toISOString(),
    category: 'crypto',
    tickers: ['BTC', 'ETH'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Polkadot anuncia integración con protocolo de mensajería cross-chain',
    description: 'DOT mejora la interoperabilidad entre parachains y redes externas con nuevo puente de comunicación.',
    source: { name: 'Blockchain Hoy' },
    publishedAt: new Date(now - 28 * h).toISOString(),
    category: 'crypto',
    tickers: ['DOT'],
    impact: 'neutral',
    url: '#',
  },

  // ═══════════════════════════════════════════
  // ACCIONES
  // ═══════════════════════════════════════════
  {
    title: 'Apple reporta ganancias récord en el último trimestre fiscal',
    description: 'Las ventas del iPhone 16 y servicios digitales impulsan resultados por encima de expectativas.',
    source: { name: 'Finanzas Digital' },
    publishedAt: new Date(now - 3 * h).toISOString(),
    category: 'acciones',
    tickers: ['AAPL'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Microsoft anuncia nueva integración de IA en productos empresariales',
    description: 'Copilot se expande a más servicios de productividad, impactando positivamente las perspectivas.',
    source: { name: 'Digital Business' },
    publishedAt: new Date(now - 5 * h).toISOString(),
    category: 'acciones',
    tickers: ['MSFT'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'NVIDIA supera expectativas con ventas de chips de IA por $22B',
    description: 'La demanda de GPUs para centros de datos de IA sigue acelerándose trimestre tras trimestre.',
    source: { name: 'Tech Finanzas' },
    publishedAt: new Date(now - 7 * h).toISOString(),
    category: 'acciones',
    tickers: ['NVDA'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Tesla enfrenta caída de ventas en China por competencia local',
    description: 'BYD y otros fabricantes reducen la cuota de mercado de Tesla en el mercado chino de EVs.',
    source: { name: 'Automotriz Global' },
    publishedAt: new Date(now - 9 * h).toISOString(),
    category: 'acciones',
    tickers: ['TSLA'],
    impact: 'bajista',
    url: '#',
  },
  {
    title: 'Amazon expande su red logística con 50 nuevos centros en Latinoamérica',
    description: 'La compañía invierte $3B en infraestructura para acelerar entregas en la región.',
    source: { name: 'Negocios Latam' },
    publishedAt: new Date(now - 11 * h).toISOString(),
    category: 'acciones',
    tickers: ['AMZN'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Alphabet enfrenta demanda antimonopolio por dominio en búsquedas',
    description: 'El Departamento de Justicia de EE.UU. busca remedios que podrían afectar el modelo de negocio de Google.',
    source: { name: 'Regulación Tech' },
    publishedAt: new Date(now - 13 * h).toISOString(),
    category: 'acciones',
    tickers: ['GOOGL'],
    impact: 'bajista',
    url: '#',
  },
  {
    title: 'Meta reporta crecimiento del 25% en ingresos publicitarios',
    description: 'Instagram Reels y la publicidad con IA generativa impulsan los resultados de la compañía.',
    source: { name: 'Digital Business' },
    publishedAt: new Date(now - 16 * h).toISOString(),
    category: 'acciones',
    tickers: ['META'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'JPMorgan eleva estimación de ganancias para el sector financiero',
    description: 'El banco ve oportunidades en la desregulación y el aumento de actividad de préstamos comerciales.',
    source: { name: 'Banca y Finanzas' },
    publishedAt: new Date(now - 18 * h).toISOString(),
    category: 'acciones',
    tickers: ['JPM'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Visa reporta aumento del 15% en volumen de transacciones globales',
    description: 'La recuperación del turismo internacional y el comercio electrónico impulsan los números.',
    source: { name: 'Finanzas Digital' },
    publishedAt: new Date(now - 21 * h).toISOString(),
    category: 'acciones',
    tickers: ['V'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Coca-Cola lanza línea de bebidas funcionales en mercados emergentes',
    description: 'La compañía diversifica su portafolio con productos de salud y bienestar en Asia y Latam.',
    source: { name: 'Consumer Markets' },
    publishedAt: new Date(now - 25 * h).toISOString(),
    category: 'acciones',
    tickers: ['KO'],
    impact: 'neutral',
    url: '#',
  },

  // ═══════════════════════════════════════════
  // CEDEARs
  // ═══════════════════════════════════════════
  {
    title: 'CEDEARs de tech lideran volumen en el mercado argentino',
    description: 'Apple, NVIDIA y MercadoLibre concentran el 45% del volumen operado en la jornada.',
    source: { name: 'Bolsa Argentina' },
    publishedAt: new Date(now - 4 * h).toISOString(),
    category: 'cedears',
    tickers: ['AAPL', 'NVDA', 'MELI'],
    impact: 'neutral',
    url: '#',
  },
  {
    title: 'MercadoLibre supera estimaciones con fuerte crecimiento en fintech',
    description: 'Mercado Pago y los créditos digitales impulsan márgenes en Argentina, Brasil y México.',
    source: { name: 'Fintech Latam' },
    publishedAt: new Date(now - 10 * h).toISOString(),
    category: 'cedears',
    tickers: ['MELI'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'El dólar CCL se estabiliza y beneficia a tenedores de CEDEARs',
    description: 'La reducción de la brecha cambiaria mejora la previsibilidad de los retornos en pesos.',
    source: { name: 'Economía Argentina' },
    publishedAt: new Date(now - 15 * h).toISOString(),
    category: 'cedears',
    tickers: [],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'CNV amplía horario de operación para CEDEARs en Argentina',
    description: 'El regulador extiende el horario para alinearse mejor con los mercados de EE.UU.',
    source: { name: 'Regulación AR' },
    publishedAt: new Date(now - 30 * h).toISOString(),
    category: 'cedears',
    tickers: [],
    impact: 'neutral',
    url: '#',
  },

  // ═══════════════════════════════════════════
  // ÍNDICES
  // ═══════════════════════════════════════════
  {
    title: 'S&P 500 cierra en máximo histórico impulsado por el sector tech',
    description: 'Las ganancias de las "Magnificent 7" llevan al índice a nuevos récords.',
    source: { name: 'Wall Street' },
    publishedAt: new Date(now - 1 * h).toISOString(),
    category: 'indices',
    tickers: ['SPY', 'VOO'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Nasdaq supera los 20,000 puntos por primera vez en su historia',
    description: 'El índice tecnológico marca un hito impulsado por la revolución de la inteligencia artificial.',
    source: { name: 'Tech Markets' },
    publishedAt: new Date(now - 6 * h).toISOString(),
    category: 'indices',
    tickers: ['QQQ'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Dow Jones retrocede ante datos de empleo más fuertes de lo esperado',
    description: 'Los inversores temen que la Fed postergue recortes de tasas ante un mercado laboral robusto.',
    source: { name: 'Economía Latina' },
    publishedAt: new Date(now - 8 * h).toISOString(),
    category: 'indices',
    tickers: ['DIA'],
    impact: 'bajista',
    url: '#',
  },
  {
    title: 'Merval argentino avanza 3.5% en la jornada con fuerte entrada de capitales',
    description: 'La renta variable argentina se beneficia de mejoras macroeconómicas y menor riesgo país.',
    source: { name: 'Bolsa Argentina' },
    publishedAt: new Date(now - 12 * h).toISOString(),
    category: 'indices',
    tickers: [],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Ibovespa brasileño cae 2% por incertidumbre fiscal del gobierno',
    description: 'Preocupaciones sobre el déficit fiscal de Brasil presionan a la bolsa de São Paulo.',
    source: { name: 'Mercados Latam' },
    publishedAt: new Date(now - 22 * h).toISOString(),
    category: 'indices',
    tickers: [],
    impact: 'bajista',
    url: '#',
  },

  // ═══════════════════════════════════════════
  // ETFs
  // ═══════════════════════════════════════════
  {
    title: 'ETF de Bitcoin de BlackRock acumula $20B en activos bajo gestión',
    description: 'IBIT se convierte en el ETF de más rápido crecimiento en la historia, superando récords de flujos.',
    source: { name: 'ETF Global' },
    publishedAt: new Date(now - 3 * h).toISOString(),
    category: 'etfs',
    tickers: ['BTC'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Vanguard VOO alcanza $500B en activos, liderando el mercado de ETFs',
    description: 'El fondo indexado al S&P 500 de Vanguard sigue atrayendo inversores pasivos globales.',
    source: { name: 'Fondos Global' },
    publishedAt: new Date(now - 9 * h).toISOString(),
    category: 'etfs',
    tickers: ['VOO', 'VTI'],
    impact: 'neutral',
    url: '#',
  },
  {
    title: 'ARK Invest reestructura su portafolio con mayor peso en IA y robótica',
    description: 'Cathie Wood aumenta posiciones en empresas de inteligencia artificial y automatización.',
    source: { name: 'Innovation Funds' },
    publishedAt: new Date(now - 16 * h).toISOString(),
    category: 'etfs',
    tickers: ['ARKK'],
    impact: 'neutral',
    url: '#',
  },
  {
    title: 'ETFs de mercados emergentes ven salida de capitales por tercer mes',
    description: 'La fortaleza del dólar y tensiones geopolíticas reducen el apetito por mercados emergentes.',
    source: { name: 'Mercados Global' },
    publishedAt: new Date(now - 23 * h).toISOString(),
    category: 'etfs',
    tickers: ['EEM', 'VXUS'],
    impact: 'bajista',
    url: '#',
  },
  {
    title: 'El oro alcanza máximos históricos y beneficia a ETFs como GLD',
    description: 'La incertidumbre global y la demanda de bancos centrales impulsan el precio del metal.',
    source: { name: 'Commodities Hoy' },
    publishedAt: new Date(now - 26 * h).toISOString(),
    category: 'etfs',
    tickers: ['GLD'],
    impact: 'alcista',
    url: '#',
  },

  // ═══════════════════════════════════════════
  // BONOS
  // ═══════════════════════════════════════════
  {
    title: 'Rendimiento del bono US10Y cae al 4.1% tras dato de inflación',
    description: 'La inflación núcleo de EE.UU. bajó al 3.2%, reforzando expectativas de recorte de tasas.',
    source: { name: 'Renta Fija Global' },
    publishedAt: new Date(now - 2 * h).toISOString(),
    category: 'bonos',
    tickers: ['US10Y'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Bonos argentinos AL30 suben 4% por reducción del riesgo país',
    description: 'El riesgo país cayó por debajo de 800 puntos, mejorando el apetito por deuda soberana.',
    source: { name: 'Deuda Soberana' },
    publishedAt: new Date(now - 7 * h).toISOString(),
    category: 'bonos',
    tickers: ['AL30', 'GD30'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'La curva de rendimientos en EE.UU. se normaliza tras 18 meses invertida',
    description: 'La desinversión de la curva 2Y-10Y señala cambios en las expectativas de política monetaria.',
    source: { name: 'Macro Research' },
    publishedAt: new Date(now - 14 * h).toISOString(),
    category: 'bonos',
    tickers: ['US10Y', 'US2Y'],
    impact: 'neutral',
    url: '#',
  },
  {
    title: 'Argentina emite nuevo bono en dólares a 2035 con fuerte demanda',
    description: 'La emisión de GD35 fue sobredimensionada 3x, mostrando confianza en la economía argentina.',
    source: { name: 'Economía Argentina' },
    publishedAt: new Date(now - 19 * h).toISOString(),
    category: 'bonos',
    tickers: ['GD35'],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'TLT cae 2% ante expectativa de tasas altas por más tiempo',
    description: 'Los bonos largos de EE.UU. sufren por la retórica restrictiva de la Reserva Federal.',
    source: { name: 'ETF Global' },
    publishedAt: new Date(now - 27 * h).toISOString(),
    category: 'bonos',
    tickers: ['TLT'],
    impact: 'bajista',
    url: '#',
  },

  // ═══════════════════════════════════════════
  // MACRO (general — afecta a todo)
  // ═══════════════════════════════════════════
  {
    title: 'La Fed mantiene las tasas de interés sin cambios en 5.25%-5.50%',
    description: 'Powell señala que los recortes vendrán cuando haya más confianza en que la inflación baje al 2%.',
    source: { name: 'Economía Latina' },
    publishedAt: new Date(now - 1 * h).toISOString(),
    category: 'macro',
    tickers: [],
    impact: 'neutral',
    url: '#',
  },
  {
    title: 'Inflación en EE.UU. baja al 3.2% interanual en febrero',
    description: 'El dato está por debajo de las expectativas del mercado, alimentando esperanzas de recorte.',
    source: { name: 'Macro Research' },
    publishedAt: new Date(now - 5 * h).toISOString(),
    category: 'macro',
    tickers: [],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Empleo en EE.UU. sorprende con 303,000 nóminas no agrícolas',
    description: 'El mercado laboral sigue robusto, lo que complica el panorama de recortes de la Fed.',
    source: { name: 'Economía Latina' },
    publishedAt: new Date(now - 11 * h).toISOString(),
    category: 'macro',
    tickers: [],
    impact: 'bajista',
    url: '#',
  },
  {
    title: 'China anuncia estímulos por $140B para reactivar su economía',
    description: 'El paquete fiscal busca impulsar el consumo interno y estabilizar el sector inmobiliario.',
    source: { name: 'Asia Markets' },
    publishedAt: new Date(now - 18 * h).toISOString(),
    category: 'macro',
    tickers: [],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Tensiones geopolíticas elevan el precio del petróleo a $85/barril',
    description: 'Conflictos en Medio Oriente generan preocupación sobre el suministro global de crudo.',
    source: { name: 'Commodities Hoy' },
    publishedAt: new Date(now - 24 * h).toISOString(),
    category: 'macro',
    tickers: [],
    impact: 'bajista',
    url: '#',
  },
  {
    title: 'BCE recorta tasas por primera vez en dos años al 3.75%',
    description: 'El Banco Central Europeo comienza su ciclo de flexibilización monetaria antes que la Fed.',
    source: { name: 'Europa Finanzas' },
    publishedAt: new Date(now - 32 * h).toISOString(),
    category: 'macro',
    tickers: [],
    impact: 'alcista',
    url: '#',
  },
  {
    title: 'Dólar global se debilita tras datos mixtos de la economía estadounidense',
    description: 'El índice DXY cae 0.8% beneficiando a activos de riesgo y mercados emergentes.',
    source: { name: 'Forex Global' },
    publishedAt: new Date(now - 36 * h).toISOString(),
    category: 'macro',
    tickers: [],
    impact: 'alcista',
    url: '#',
  },
];

// ═══════════════════════════════════════════
// Funciones de filtrado
// ═══════════════════════════════════════════

/**
 * Get news by category with optional limit
 */
export function getNewsByCategory(category = 'todo', limit = 20) {
  let news = [...mockNewsData];
  if (category && category !== 'todo') {
    news = news.filter(n => n.category === category);
  }
  // Sort by date (newest first)
  news.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  return news.slice(0, limit);
}

/**
 * Get news relevant to a specific asset
 * Searches by ticker match first, then falls back to category
 */
export function getNewsByAsset(ticker, category, limit = 5) {
  const upperTicker = ticker?.toUpperCase();

  // 1. Direct ticker match
  let matched = mockNewsData.filter(n =>
    n.tickers.some(t => t.toUpperCase() === upperTicker)
  );

  // 2. CEDEARs: also search the underlying ticker
  if (category === 'cedears' && upperTicker) {
    const base = upperTicker.replace('CEDEAR-', '').replace('.BA', '');
    const baseMatches = mockNewsData.filter(n =>
      n.tickers.some(t => t.toUpperCase() === base) &&
      !matched.includes(n)
    );
    matched = [...matched, ...baseMatches];
  }

  // 3. If not enough, add category news
  if (matched.length < limit) {
    const catNews = mockNewsData.filter(n =>
      n.category === category && !matched.includes(n)
    );
    matched = [...matched, ...catNews];
  }

  // 4. If still not enough, add macro news
  if (matched.length < limit) {
    const macroNews = mockNewsData.filter(n =>
      n.category === 'macro' && !matched.includes(n)
    );
    matched = [...matched, ...macroNews];
  }

  matched.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  return matched.slice(0, limit);
}

/**
 * Search news by query
 */
export function searchNews(query, limit = 20) {
  if (!query || query.length < 2) return getNewsByCategory('todo', limit);
  const q = query.toLowerCase();
  return mockNewsData
    .filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.tickers.some(t => t.toLowerCase().includes(q)) ||
      n.source.name.toLowerCase().includes(q)
    )
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit);
}

/**
 * Get featured news (one from each main category)
 */
export function getFeaturedNews() {
  const categories = ['crypto', 'acciones', 'indices', 'macro'];
  const featured = [];
  for (const cat of categories) {
    const catNews = mockNewsData
      .filter(n => n.category === cat)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    if (catNews[0]) featured.push(catNews[0]);
  }
  return featured;
}
