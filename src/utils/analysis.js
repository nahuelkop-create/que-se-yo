// Technical analysis utilities
// Utilidades de análisis técnico

/**
 * Calculate Simple Moving Average (Media Móvil Simple)
 */
export function calcSMA(data, period) {
  if (!data || data.length < period) return null;
  const slice = data.slice(-period);
  const sum = slice.reduce((acc, val) => acc + (val.close || val.price || val), 0);
  return parseFloat((sum / period).toFixed(2));
}

/**
 * Calculate RSI (Índice de Fuerza Relativa)
 */
export function calcRSI(data, period = 14) {
  if (!data || data.length < period + 1) return null;
  
  const prices = data.map(d => d.close || d.price || d);
  const changes = [];
  
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }
  
  const recentChanges = changes.slice(-period);
  let gains = 0;
  let losses = 0;
  
  for (const change of recentChanges) {
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  return parseFloat(rsi.toFixed(1));
}

/**
 * Detect trend (Detectar tendencia)
 * Returns: 'alcista' | 'bajista' | 'neutral'
 */
export function detectTrend(currentPrice, sma20, sma50) {
  if (!sma20 || !sma50) return 'neutral';
  
  if (currentPrice > sma20 && sma20 > sma50) return 'alcista';
  if (currentPrice < sma20 && sma20 < sma50) return 'bajista';
  return 'neutral';
}

/**
 * Get recommendation based on trend and RSI
 * Returns: { signal, description, color }
 */
export function getRecommendation(trend, rsi) {
  if (trend === 'alcista') {
    if (rsi !== null && rsi >= 70) {
      return {
        signal: 'Esperar',
        description: 'Tendencia alcista pero sobrecomprado',
        color: 'neutral',
      };
    }
    return {
      signal: 'Compra Posible',
      description: 'Tendencia alcista confirmada',
      color: 'bullish',
    };
  }
  
  if (trend === 'bajista') {
    if (rsi !== null && rsi <= 30) {
      return {
        signal: 'Esperar',
        description: 'Tendencia bajista pero sobrevendido',
        color: 'neutral',
      };
    }
    return {
      signal: 'Precaución',
      description: 'Señales bajistas predominan',
      color: 'bearish',
    };
  }
  
  return {
    signal: 'Esperar',
    description: 'Señales mixtas, sin tendencia clara',
    color: 'neutral',
  };
}

/**
 * Generate outlook text in Spanish
 */
export function generateOutlook(symbol, trend, rsi, changePercent) {
  const trendText = {
    alcista: 'una tendencia alcista',
    bajista: 'una tendencia bajista',
    neutral: 'una tendencia lateral',
  };
  
  let rsiText = '';
  if (rsi !== null) {
    if (rsi >= 70) rsiText = ' El RSI indica condiciones de sobrecompra.';
    else if (rsi <= 30) rsiText = ' El RSI sugiere condiciones de sobreventa.';
    else rsiText = ` El RSI se encuentra en ${rsi}, dentro de rango neutral.`;
  }
  
  const momentumText = changePercent > 0
    ? `un impulso positivo del ${Math.abs(changePercent).toFixed(2)}%`
    : `una presión bajista del ${Math.abs(changePercent).toFixed(2)}%`;
  
  return `${symbol} muestra ${trendText[trend]} con ${momentumText}.${rsiText}`;
}

/**
 * Process price data for a stock/crypto and compute all indicators
 */
export function analyzeAsset(priceHistory, currentPrice = null) {
  if (!priceHistory || priceHistory.length === 0) {
    return {
      currentPrice: 0,
      change: 0,
      changePercent: 0,
      sma20: null,
      sma50: null,
      rsi: null,
      trend: 'neutral',
      recommendation: getRecommendation('neutral', null),
    };
  }
  
  const latest = priceHistory[priceHistory.length - 1];
  const previous = priceHistory.length > 1 ? priceHistory[priceHistory.length - 2] : latest;
  const price = currentPrice || latest.close || latest.price;
  const prevPrice = previous.close || previous.price;
  const change = price - prevPrice;
  const changePercent = (change / prevPrice) * 100;
  
  const sma20 = calcSMA(priceHistory, 20);
  const sma50 = calcSMA(priceHistory, 50);
  const rsi = calcRSI(priceHistory);
  const trend = detectTrend(price, sma20, sma50);
  const recommendation = getRecommendation(trend, rsi);
  
  return {
    currentPrice: price,
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    sma20,
    sma50,
    rsi,
    trend,
    recommendation,
  };
}

/**
 * Format currency
 */
export function formatCurrency(value, currency = 'USD') {
  if (value === null || value === undefined) return '—';
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
}

/**
 * Format large number
 */
export function formatNumber(value) {
  if (value === null || value === undefined) return '—';
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(0);
}
