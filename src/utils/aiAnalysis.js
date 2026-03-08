// Motor de análisis IA por horizonte temporal
// Genera análisis contextual basado en reglas técnicas coherentes
// Diseñado para ser reemplazable por un backend de IA real sin cambiar la interfaz

import { calcSMA, calcRSI, detectTrend, formatCurrency } from './analysis';

// ═══════════════════════════════════════════
// Configuración por período
// ═══════════════════════════════════════════

const PERIOD_CONFIG = {
  '1D': {
    label: '1 día',
    futureLabel: 'las próximas horas',
    horizon: 'intradía',
    volatilityMult: 0.3,
    confidenceBase: 45,
  },
  '1W': {
    label: '1 semana',
    futureLabel: 'la próxima semana',
    horizon: 'corto plazo',
    volatilityMult: 0.6,
    confidenceBase: 50,
  },
  '1M': {
    label: '1 mes',
    futureLabel: 'el próximo mes',
    horizon: 'mediano plazo',
    volatilityMult: 1.0,
    confidenceBase: 55,
  },
  '1Y': {
    label: '1 año',
    futureLabel: 'el próximo año',
    horizon: 'largo plazo',
    volatilityMult: 2.5,
    confidenceBase: 40,
  },
  'MAX': {
    label: 'máximo histórico',
    futureLabel: 'el largo plazo',
    horizon: 'perspectiva general',
    volatilityMult: 4.0,
    confidenceBase: 35,
  },
};

// ═══════════════════════════════════════════
// Cálculo de soporte y resistencia
// ═══════════════════════════════════════════

/**
 * Calculate support level from local minimums
 */
export function calcSupport(data, lookback = 20) {
  if (!data || data.length < 5) return null;
  const prices = data.slice(-Math.min(lookback, data.length));
  const lows = prices.map(d => d.low || d.close || d.price || d);
  
  // Find the lowest valley
  let support = Infinity;
  for (let i = 1; i < lows.length - 1; i++) {
    if (lows[i] < lows[i - 1] && lows[i] < lows[i + 1]) {
      support = Math.min(support, lows[i]);
    }
  }
  
  // Fallback: use the overall minimum
  if (support === Infinity) {
    support = Math.min(...lows);
  }
  
  return parseFloat(support.toFixed(2));
}

/**
 * Calculate resistance level from local maximums
 */
export function calcResistance(data, lookback = 20) {
  if (!data || data.length < 5) return null;
  const prices = data.slice(-Math.min(lookback, data.length));
  const highs = prices.map(d => d.high || d.close || d.price || d);
  
  // Find the highest peak
  let resistance = -Infinity;
  for (let i = 1; i < highs.length - 1; i++) {
    if (highs[i] > highs[i - 1] && highs[i] > highs[i + 1]) {
      resistance = Math.max(resistance, highs[i]);
    }
  }
  
  // Fallback: use the overall maximum
  if (resistance === -Infinity) {
    resistance = Math.max(...highs);
  }
  
  return parseFloat(resistance.toFixed(2));
}

// ═══════════════════════════════════════════
// Interpretaciones individuales
// ═══════════════════════════════════════════

function interpretRSI(rsi) {
  if (rsi === null || rsi === undefined) {
    return { level: 'sin_datos', text: 'No hay datos suficientes para calcular el RSI.', color: 'neutral' };
  }
  if (rsi >= 80) return { level: 'extremo_sobrecompra', text: `RSI en ${rsi} — zona de sobrecompra extrema. Alta probabilidad de corrección a la baja.`, color: 'bearish' };
  if (rsi >= 70) return { level: 'sobrecompra', text: `RSI en ${rsi} — zona de sobrecompra. El precio podría estar agotando su subida.`, color: 'bearish' };
  if (rsi >= 55) return { level: 'fuerza', text: `RSI en ${rsi} — momentum positivo. La presión compradora supera a la vendedora.`, color: 'bullish' };
  if (rsi >= 45) return { level: 'neutral', text: `RSI en ${rsi} — zona neutral. No hay presión clara en ninguna dirección.`, color: 'neutral' };
  if (rsi >= 30) return { level: 'debilidad', text: `RSI en ${rsi} — momentum negativo. La presión vendedora domina el mercado.`, color: 'bearish' };
  if (rsi >= 20) return { level: 'sobreventa', text: `RSI en ${rsi} — zona de sobreventa. Puede haber un rebote alcista próximo.`, color: 'bullish' };
  return { level: 'extremo_sobreventa', text: `RSI en ${rsi} — sobreventa extrema. Alta probabilidad de rebote técnico.`, color: 'bullish' };
}

function interpretSMA(currentPrice, sma20, sma50) {
  if (!sma20 && !sma50) {
    return { text: 'No hay suficientes datos para calcular las medias móviles.', signal: 'neutral' };
  }

  const parts = [];
  let signal = 'neutral';

  if (sma20 && sma50) {
    if (currentPrice > sma20 && sma20 > sma50) {
      parts.push('El precio opera por encima de ambas medias móviles (SMA 20 y SMA 50), con la de corto plazo por encima de la de largo plazo');
      signal = 'bullish';
    } else if (currentPrice < sma20 && sma20 < sma50) {
      parts.push('El precio opera por debajo de ambas medias móviles, con cruce bajista confirmado');
      signal = 'bearish';
    } else if (currentPrice > sma20 && sma20 < sma50) {
      parts.push('El precio recuperó la SMA 20 pero aún no supera la SMA 50. Señal de posible recuperación');
      signal = 'neutral';
    } else {
      parts.push('El precio se encuentra entre ambas medias móviles, indicando indecisión del mercado');
      signal = 'neutral';
    }
  } else if (sma20) {
    if (currentPrice > sma20) {
      parts.push('El precio opera por encima de la SMA 20, lo que sugiere impulso positivo de corto plazo');
      signal = 'bullish';
    } else {
      parts.push('El precio opera por debajo de la SMA 20, lo que sugiere presión bajista de corto plazo');
      signal = 'bearish';
    }
  }

  return { text: parts.join('. ') + '.', signal };
}

function interpretSupportResistance(currentPrice, support, resistance) {
  if (!support || !resistance) {
    return { text: 'No se pudieron identificar niveles claros de soporte y resistencia.', proximity: 'unknown' };
  }

  const range = resistance - support;
  if (range <= 0) return { text: 'Los niveles de soporte y resistencia son muy cercanos.', proximity: 'compressed' };

  const position = (currentPrice - support) / range;
  const distToSupport = ((currentPrice - support) / currentPrice * 100).toFixed(1);
  const distToResist = ((resistance - currentPrice) / currentPrice * 100).toFixed(1);

  if (position > 0.85) {
    return {
      text: `El precio está cerca de la resistencia (${formatCurrency(resistance)}), a solo ${distToResist}% de distancia. Una ruptura al alza abriría nuevos máximos; un rechazo podría generar corrección.`,
      proximity: 'near_resistance',
    };
  }
  if (position < 0.15) {
    return {
      text: `El precio está cerca del soporte (${formatCurrency(support)}), a ${distToSupport}% de distancia. Si se mantiene este nivel, podría iniciar un rebote; si se quiebra, habría más caída.`,
      proximity: 'near_support',
    };
  }
  return {
    text: `El precio opera a ${distToSupport}% del soporte (${formatCurrency(support)}) y a ${distToResist}% de la resistencia (${formatCurrency(resistance)}).`,
    proximity: 'middle',
  };
}

// ═══════════════════════════════════════════
// Estimación de porcentaje
// ═══════════════════════════════════════════

function estimateRange(trend, rsi, changePercent, period, support, resistance, currentPrice) {
  const config = PERIOD_CONFIG[period] || PERIOD_CONFIG['1M'];
  const baseVol = Math.abs(changePercent || 1) * config.volatilityMult;

  // Adjust based on trend
  let upBias = 0;
  if (trend === 'alcista') upBias = baseVol * 0.3;
  if (trend === 'bajista') upBias = -baseVol * 0.3;

  // Adjust based on RSI
  if (rsi !== null) {
    if (rsi >= 70) upBias -= baseVol * 0.2;
    if (rsi <= 30) upBias += baseVol * 0.2;
  }

  // Adjust based on support/resistance proximity
  if (support && resistance && currentPrice) {
    const range = resistance - support;
    if (range > 0) {
      const pos = (currentPrice - support) / range;
      if (pos > 0.8) upBias -= baseVol * 0.15; // near resistance, less upside
      if (pos < 0.2) upBias += baseVol * 0.15; // near support, more upside
    }
  }

  const upside = Math.max(0.5, baseVol + upBias);
  const downside = Math.max(0.5, baseVol - upBias);

  return {
    upside: parseFloat(upside.toFixed(1)),
    downside: parseFloat(downside.toFixed(1)),
    confidence: Math.min(70, config.confidenceBase + (rsi !== null ? 10 : 0) + (support ? 5 : 0)),
  };
}

// ═══════════════════════════════════════════
// Recomendación final
// ═══════════════════════════════════════════

function generateRecommendation(trend, rsi, smaSignal, srProximity) {
  let score = 0; // -3 to +3

  // Trend contribution
  if (trend === 'alcista') score += 1;
  if (trend === 'bajista') score -= 1;

  // RSI contribution
  if (rsi !== null) {
    if (rsi >= 70) score -= 1;
    else if (rsi >= 55) score += 0.5;
    else if (rsi <= 30) score += 1;
    else if (rsi <= 45) score -= 0.5;
  }

  // SMA contribution
  if (smaSignal === 'bullish') score += 0.5;
  if (smaSignal === 'bearish') score -= 0.5;

  // S/R proximity
  if (srProximity === 'near_support') score += 0.5;
  if (srProximity === 'near_resistance') score -= 0.5;

  if (score >= 1.5) {
    return {
      action: 'Comprar',
      color: 'bullish',
      icon: '📈',
      text: 'Las señales técnicas confluyen positivamente. Puede ser un buen momento para considerar posiciones.',
    };
  }
  if (score <= -1.5) {
    return {
      action: 'Vender',
      color: 'bearish',
      icon: '📉',
      text: 'Las señales técnicas son predominantemente negativas. Considerar reducir exposición o proteger ganancias.',
    };
  }
  return {
    action: 'Esperar',
    color: 'neutral',
    icon: '⏳',
    text: 'Las señales son mixtas o insuficientes para una decisión clara. Conviene esperar confirmación.',
  };
}

// ═══════════════════════════════════════════
// Texto contextual
// ═══════════════════════════════════════════

function generateContextText(ticker, period, trend, rsi, smaInterp, srInterp, estimate, recommendation) {
  const config = PERIOD_CONFIG[period] || PERIOD_CONFIG['1M'];
  const trendText = { alcista: 'alcista', bajista: 'bajista', neutral: 'lateral' };

  const parts = [];

  // Opening
  parts.push(`En el horizonte de ${config.futureLabel}, ${ticker} muestra una tendencia ${trendText[trend]}.`);

  // RSI context (simplified)
  if (rsi !== null) {
    if (rsi >= 70) parts.push(`El indicador de fuerza relativa (${rsi}) indica que el activo está sobrecomprado, lo que puede anticipar una corrección.`);
    else if (rsi <= 30) parts.push(`El indicador de fuerza relativa (${rsi}) sugiere sobreventa, lo que históricamente precede a rebotes.`);
    else parts.push(`El indicador de fuerza relativa se mantiene en zona neutral (${rsi}), sin señales extremas.`);
  }

  // Estimate
  parts.push(`Basado en el análisis técnico, se estima un rango de movimiento entre +${estimate.upside}% y -${estimate.downside}% para ${config.futureLabel}.`);

  // Closing
  parts.push(`Esta estimación tiene un nivel de confianza del ${estimate.confidence}% y se basa exclusivamente en indicadores técnicos. Factores fundamentales y eventos macroeconómicos pueden alterar significativamente este escenario.`);

  return parts.join(' ');
}

// ═══════════════════════════════════════════
// Función principal
// ═══════════════════════════════════════════

/**
 * Generate complete AI analysis for an asset given its chart data and period
 * 
 * @param {string} ticker - Asset ticker (e.g. 'BTC', 'AAPL')
 * @param {Array} chartData - OHLCV data array
 * @param {string} period - Selected period ('1D', '1W', '1M', '1Y', 'MAX')
 * @param {number} currentPrice - Current price
 * @returns {Object} Complete analysis object
 */
export function generateAIAnalysis(ticker, chartData, period, currentPrice) {
  if (!chartData || chartData.length < 5) {
    return {
      hasData: false,
      periodLabel: PERIOD_CONFIG[period]?.label || period,
      message: 'No hay suficientes datos históricos para generar un análisis completo en este período.',
    };
  }

  // Calculate indicators
  const sma20 = calcSMA(chartData, 20);
  const sma50 = calcSMA(chartData, 50);
  const rsi = calcRSI(chartData);
  const trend = detectTrend(currentPrice, sma20, sma50);
  const support = calcSupport(chartData);
  const resistance = calcResistance(chartData);

  // Change percent from chart data
  const firstPrice = chartData[0]?.close || chartData[0]?.price || currentPrice;
  const changePercent = ((currentPrice - firstPrice) / firstPrice) * 100;

  // Interpretations
  const rsiInterp = interpretRSI(rsi);
  const smaInterp = interpretSMA(currentPrice, sma20, sma50);
  const srInterp = interpretSupportResistance(currentPrice, support, resistance);
  const estimate = estimateRange(trend, rsi, changePercent, period, support, resistance, currentPrice);
  const recommendation = generateRecommendation(trend, rsi, smaInterp.signal, srInterp.proximity);
  const contextText = generateContextText(ticker, period, trend, rsi, smaInterp, srInterp, estimate, recommendation);

  return {
    hasData: true,
    periodLabel: PERIOD_CONFIG[period]?.label || period,
    futureLabel: PERIOD_CONFIG[period]?.futureLabel || 'el futuro',
    horizon: PERIOD_CONFIG[period]?.horizon || 'general',

    // Raw values
    trend,
    rsi,
    sma20,
    sma50,
    support,
    resistance,
    changePercent: parseFloat(changePercent.toFixed(2)),

    // Interpretations
    rsiInterpretation: rsiInterp,
    smaInterpretation: smaInterp,
    srInterpretation: srInterp,

    // Estimate & recommendation
    estimate,
    recommendation,

    // Context text for non-technical users
    contextText,
  };
}
