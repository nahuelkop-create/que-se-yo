/**
 * Radar IA Engine — Motor de scoring y clasificación técnica
 * Analiza activos usando indicadores técnicos y genera rankings por categoría
 * Diseñado para ser modular y reemplazable por IA real en el futuro
 */

// ═══════════════════════════════════════════
// SCORING WEIGHTS
// ═══════════════════════════════════════════
const WEIGHTS = {
  rsi: 0.25,
  trend: 0.25,
  momentum: 0.20,
  volatility: 0.15,
  supportProximity: 0.15,
};

// ═══════════════════════════════════════════
// TECHNICAL CALCULATIONS
// ═══════════════════════════════════════════

function calculateSMA(prices, period) {
  if (!prices || prices.length < period) return null;
  const slice = prices.slice(-period);
  return slice.reduce((s, p) => s + p, 0) / period;
}

function calculateRSI(prices, period = 14) {
  if (!prices || prices.length < period + 1) return 50;
  const changes = [];
  for (let i = prices.length - period; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }
  const gains = changes.filter(c => c > 0);
  const losses = changes.filter(c => c < 0).map(c => Math.abs(c));
  const avgGain = gains.length > 0 ? gains.reduce((s, g) => s + g, 0) / period : 0;
  const avgLoss = losses.length > 0 ? losses.reduce((s, l) => s + l, 0) / period : 0.001;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function calculateVolatility(prices, period = 14) {
  if (!prices || prices.length < period) return 0;
  const slice = prices.slice(-period);
  const mean = slice.reduce((s, p) => s + p, 0) / slice.length;
  const variance = slice.reduce((s, p) => s + Math.pow(p - mean, 2), 0) / slice.length;
  return Math.sqrt(variance) / mean * 100; // % volatility
}

function calculateSupport(prices, period = 20) {
  if (!prices || prices.length < period) return null;
  const slice = prices.slice(-period);
  return Math.min(...slice);
}

function calculateResistance(prices, period = 20) {
  if (!prices || prices.length < period) return null;
  const slice = prices.slice(-period);
  return Math.max(...slice);
}

// ═══════════════════════════════════════════
// SCORING FUNCTIONS
// ═══════════════════════════════════════════

/**
 * RSI Score: 0-100
 * Sweet spot at RSI 30-50 (buying opportunity)
 * Penalizes extreme overbought (>75) and rewards oversold (<30)
 */
function scoreRSI(rsi) {
  if (rsi <= 25) return 90;  // Extremely oversold = high opportunity
  if (rsi <= 35) return 80;
  if (rsi <= 45) return 70;
  if (rsi <= 55) return 55;  // Neutral
  if (rsi <= 65) return 40;
  if (rsi <= 75) return 25;
  return 10;                  // Overbought = low opportunity
}

/**
 * Trend Score: 0-100
 * Based on price vs SMA20 and SMA20 vs SMA50
 */
function scoreTrend(price, sma20, sma50) {
  let score = 50;
  if (sma20 && price > sma20) score += 15;
  if (sma20 && price < sma20) score -= 15;
  if (sma20 && sma50) {
    if (sma20 > sma50) score += 20;  // Golden cross
    if (sma20 < sma50) score -= 20;  // Death cross
  }
  if (sma20 && price > sma20 * 1.02) score += 10;  // Strong above
  if (sma20 && price < sma20 * 0.98) score -= 10;  // Strong below
  return Math.max(0, Math.min(100, score));
}

/**
 * Momentum Score: 0-100
 * Based on recent price change
 */
function scoreMomentum(changePercent) {
  if (changePercent >= 8) return 95;
  if (changePercent >= 5) return 85;
  if (changePercent >= 3) return 75;
  if (changePercent >= 1) return 65;
  if (changePercent >= 0) return 50;
  if (changePercent >= -2) return 35;
  if (changePercent >= -5) return 20;
  return 10;
}

/**
 * Volatility Score: 0-100
 * Lower volatility = more stable = higher score for opportunity
 */
function scoreVolatility(volatility) {
  if (volatility <= 1) return 85;
  if (volatility <= 2) return 70;
  if (volatility <= 4) return 55;
  if (volatility <= 6) return 40;
  if (volatility <= 10) return 25;
  return 15;
}

/**
 * Support Proximity Score: 0-100
 * Closer to support = higher score (bounce potential)
 */
function scoreSupportProximity(price, support, resistance) {
  if (!support || !resistance || support === resistance) return 50;
  const range = resistance - support;
  const position = (price - support) / range; // 0 = at support, 1 = at resistance
  return Math.max(0, Math.min(100, Math.round((1 - position) * 100)));
}

// ═══════════════════════════════════════════
// SIGNAL DETECTION
// ═══════════════════════════════════════════

function detectSignals(price, rsi, sma20, sma50, changePercent, support, resistance) {
  const signals = [];

  // RSI signals
  if (rsi <= 25) signals.push({ type: 'oversold_extreme', text: 'RSI en sobreventa extrema', impact: 'alcista' });
  else if (rsi <= 35) signals.push({ type: 'oversold', text: 'RSI en zona de sobreventa', impact: 'alcista' });
  else if (rsi >= 80) signals.push({ type: 'overbought_extreme', text: 'RSI en sobrecompra extrema', impact: 'bajista' });
  else if (rsi >= 70) signals.push({ type: 'overbought', text: 'RSI en zona de sobrecompra', impact: 'bajista' });

  // SMA signals
  if (sma20 && sma50) {
    const crossRatio = sma20 / sma50;
    if (crossRatio > 1.0 && crossRatio < 1.02) {
      signals.push({ type: 'golden_cross', text: 'Cruce alcista de medias reciente', impact: 'alcista' });
    } else if (crossRatio < 1.0 && crossRatio > 0.98) {
      signals.push({ type: 'death_cross', text: 'Cruce bajista de medias reciente', impact: 'bajista' });
    }
  }

  // Support/Resistance signals
  if (support && price < support * 1.02) {
    signals.push({ type: 'near_support', text: 'Precio cerca de soporte clave', impact: 'alcista' });
  }
  if (resistance && price > resistance * 0.98) {
    signals.push({ type: 'near_resistance', text: 'Precio cerca de resistencia', impact: 'bajista' });
  }

  // Momentum signals
  if (changePercent >= 5) signals.push({ type: 'strong_momentum', text: 'Momentum alcista fuerte', impact: 'alcista' });
  if (changePercent <= -5) signals.push({ type: 'strong_sell', text: 'Presión vendedora intensa', impact: 'bajista' });

  // Trend signals
  if (sma20 && price > sma20 * 1.05) {
    signals.push({ type: 'above_sma', text: 'Precio significativamente sobre SMA 20', impact: 'alcista' });
  }
  if (sma20 && price < sma20 * 0.95) {
    signals.push({ type: 'below_sma', text: 'Precio significativamente bajo SMA 20', impact: 'bajista' });
  }

  return signals;
}

// ═══════════════════════════════════════════
// EXPLANATION GENERATOR
// ═══════════════════════════════════════════

function generateExplanation(category, asset, metrics) {
  const { rsi, sma20, changePercent, support, totalScore } = metrics;

  switch (category) {
    case 'opportunities':
      if (rsi < 40 && changePercent > 0) return `RSI atractivo en ${rsi.toFixed(0)} con momentum positivo. Posición favorable para continuación.`;
      if (sma20 && metrics.price > sma20) return `Cotiza sobre SMA 20 con señales técnicas favorables. Score técnico: ${totalScore}/100.`;
      return `Combinación técnica atractiva con score ${totalScore}/100. Múltiples indicadores alineados.`;

    case 'oversold':
      if (rsi < 25) return `RSI extremadamente bajo en ${rsi.toFixed(0)}. La presión vendedora podría estar agotándose.`;
      return `RSI en ${rsi.toFixed(0)}, zona de sobreventa. Históricamente, estos niveles suelen preceder rebotes técnicos.`;

    case 'momentum':
      if (changePercent > 5) return `Sube ${changePercent.toFixed(1)}% con fuerza. Inercia alcista sostenida con volumen.`;
      return `Variación de +${changePercent.toFixed(1)}% y tendencia definida. Momentum positivo activo.`;

    case 'risk':
      if (rsi > 75) return `RSI en ${rsi.toFixed(0)}, zona de sobrecompra. Riesgo de corrección técnica elevado.`;
      if (changePercent < -3) return `Caída de ${Math.abs(changePercent).toFixed(1)}% con debilidad técnica. Precaución recomendada.`;
      return `Señales técnicas débiles con deterioro en indicadores. Score bajo: ${totalScore}/100.`;

    default:
      return `Señal técnica detectada en ${asset.ticker}.`;
  }
}

// ═══════════════════════════════════════════
// MAIN RADAR ANALYSIS
// ═══════════════════════════════════════════

/**
 * Analyze all assets and generate radar classifications
 * @param {Array} assets - Asset catalog
 * @param {Object} priceCache - Price data keyed by asset.id
 * @returns {Object} Radar results with classified assets
 */
export function analyzeRadar(assets, priceCache) {
  const scored = [];

  for (const asset of assets) {
    const priceData = priceCache[asset.id];
    if (!priceData || !priceData.price) continue;

    const prices = priceData.sparkline || [];
    const price = priceData.price;
    const changePercent = priceData.changePercent || 0;

    // Calculate technicals
    const rsi = calculateRSI(prices);
    const sma20 = calculateSMA(prices, Math.min(20, prices.length));
    const sma50 = calculateSMA(prices, Math.min(50, prices.length));
    const volatility = calculateVolatility(prices);
    const support = calculateSupport(prices);
    const resistance = calculateResistance(prices);

    // Calculate scores
    const rsiScore = scoreRSI(rsi);
    const trendScore = scoreTrend(price, sma20, sma50);
    const momentumScore = scoreMomentum(changePercent);
    const volatilityScore = scoreVolatility(volatility);
    const supportScore = scoreSupportProximity(price, support, resistance);

    const totalScore = Math.round(
      rsiScore * WEIGHTS.rsi +
      trendScore * WEIGHTS.trend +
      momentumScore * WEIGHTS.momentum +
      volatilityScore * WEIGHTS.volatility +
      supportScore * WEIGHTS.supportProximity
    );

    // Detect signals
    const signals = detectSignals(price, rsi, sma20, sma50, changePercent, support, resistance);

    // Build metrics object
    const metrics = {
      price, changePercent, rsi, sma20, sma50, volatility,
      support, resistance, totalScore,
      rsiScore, trendScore, momentumScore,
      signals,
    };

    scored.push({ asset, priceData, metrics });
  }

  // Sort by total score descending
  scored.sort((a, b) => b.metrics.totalScore - a.metrics.totalScore);

  // ═══ CLASSIFY INTO CATEGORIES ═══

  // Top Opportunities: highest overall score
  const opportunities = scored
    .slice(0, 5)
    .map(item => ({
      ...item,
      explanation: generateExplanation('opportunities', item.asset, item.metrics),
    }));

  // Oversold Extreme: RSI < 35, sorted by lowest RSI
  const oversold = scored
    .filter(item => item.metrics.rsi < 35)
    .sort((a, b) => a.metrics.rsi - b.metrics.rsi)
    .slice(0, 5)
    .map(item => ({
      ...item,
      explanation: generateExplanation('oversold', item.asset, item.metrics),
    }));

  // Strong Momentum: biggest positive change, RSI not extreme
  const momentum = scored
    .filter(item => item.metrics.changePercent > 0)
    .sort((a, b) => b.metrics.changePercent - a.metrics.changePercent)
    .slice(0, 5)
    .map(item => ({
      ...item,
      explanation: generateExplanation('momentum', item.asset, item.metrics),
    }));

  // High Risk: lowest score or RSI > 70, sorted ascending
  const risk = scored
    .filter(item => item.metrics.totalScore < 45 || item.metrics.rsi > 70)
    .sort((a, b) => a.metrics.totalScore - b.metrics.totalScore)
    .slice(0, 5)
    .map(item => ({
      ...item,
      explanation: generateExplanation('risk', item.asset, item.metrics),
    }));

  // Notable Signals: assets with 2+ signals
  const signalsHighlight = scored
    .filter(item => item.metrics.signals.length >= 1)
    .sort((a, b) => b.metrics.signals.length - a.metrics.signals.length)
    .slice(0, 6)
    .map(item => ({
      ...item,
      explanation: item.metrics.signals.map(s => s.text).join('. ') + '.',
    }));

  return {
    opportunities,
    oversold,
    momentum,
    risk,
    signals: signalsHighlight,
    totalAnalyzed: scored.length,
    timestamp: new Date().toISOString(),
  };
}
