import { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Info, BarChart2, Star } from 'lucide-react';
import { fetchAssetPrice, fetchAssetHistory } from '../services/assetService';
import { analyzeAsset, formatCurrency, formatNumber } from '../utils/analysis';
import { generateAIAnalysis } from '../utils/aiAnalysis';
import CandlestickChart from './CandlestickChart';
import PeriodSelector from './PeriodSelector';
import AIAnalysis from './AIAnalysis';
import AssetNews from './AssetNews';

export default function AssetDetail({ asset, onBack, settings, isFavorite, onToggleFavorite }) {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('1M');
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);

  // Load price data
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchAssetPrice(asset, settings).then(data => {
      if (!cancelled) {
        setPriceData(data);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [asset.id, settings]);

  // Load chart data when period changes
  const loadChartData = useCallback(async () => {
    setChartLoading(true);
    try {
      const result = await fetchAssetHistory(asset, period, settings);
      // fetchAssetHistory now returns { data, dataQuality }
      setChartData(result.data || result);
    } catch {
      setChartData(null);
    } finally {
      setChartLoading(false);
    }
  }, [asset, period, settings]);

  useEffect(() => {
    loadChartData();
  }, [loadChartData]);

  // Compute analysis from chart data (period-aware)
  const analysis = chartData && chartData.length > 0
    ? analyzeAsset(chartData, chartData[chartData.length - 1]?.close)
    : priceData?.priceHistory
      ? analyzeAsset(priceData.priceHistory, priceData.price)
      : null;

  const isUp = priceData?.changePercent >= 0;

  const trendLabel = { alcista: 'Alcista', bajista: 'Bajista', neutral: 'Neutral' };
  const trendIcon = {
    alcista: <TrendingUp size={14} />,
    bajista: <TrendingDown size={14} />,
    neutral: <Minus size={14} />,
  };

  const categoryLabels = {
    crypto: 'Criptomoneda', acciones: 'Acción', cedears: 'CEDEAR',
    indices: 'Índice', etfs: 'ETF', bonos: 'Bono',
  };

  const periodLabels = { '1D': '1 día', '1W': '1 semana', '1M': '1 mes', '1Y': '1 año', 'MAX': 'máximo histórico' };

  // AI Analysis — only when data is REAL and indicators are complete
  const dataIsReliable = priceData?.dataQuality?.isReal === true;
  const hasEnoughHistory = chartData && chartData.length >= 15;
  const canRunAnalysis = dataIsReliable && hasEnoughHistory;

  const aiAnalysis = useMemo(() => {
    if (!canRunAnalysis) {
      return {
        hasData: false,
        periodLabel: periodLabels[period] || period,
        message: !dataIsReliable
          ? 'No se puede generar análisis técnico sin datos reales del mercado.'
          : 'No hay suficientes datos históricos para calcular indicadores (se necesitan RSI, SMA20, SMA50 y velas).',
      };
    }
    const price = priceData?.price || chartData?.[chartData.length - 1]?.close;
    const result = generateAIAnalysis(asset.ticker, chartData, period, price);

    // Post-validate: check that key indicators exist
    if (result.hasData && (result.rsi === null || result.sma20 === null || result.sma50 === null)) {
      return {
        hasData: false,
        periodLabel: result.periodLabel,
        message: 'No hay suficientes datos para calcular todos los indicadores necesarios (RSI, SMA20, SMA50). El análisis requiere más historial.',
      };
    }

    return result;
  }, [chartData, period, priceData, asset.ticker, canRunAnalysis, dataIsReliable]);

  return (
    <div className="asset-detail fade-in-up">
      {/* Header */}
      <div className="ad-header">
        <button className="ad-back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="ad-header-info">
          <h2 className="ad-header-name">{asset.name}</h2>
          <span className="ad-header-meta">
            {asset.ticker} · {categoryLabels[asset.category] || asset.category}
            {asset.ratio ? ` · Ratio ${asset.ratio}` : ''}
          </span>
        </div>
        {onToggleFavorite && (
          <button
            className={`ad-fav-btn ${isFavorite ? 'ad-fav-active' : ''}`}
            onClick={() => onToggleFavorite(asset.ticker)}
            title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        )}
        {asset.image && (
          <img src={asset.image} alt="" className="ad-header-icon" onError={(e) => { e.target.style.display = 'none'; }} />
        )}
      </div>

      {loading ? (
        <div className="container">
          <div className="skeleton" style={{ height: 80, borderRadius: 16, marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 320, borderRadius: 16, marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 150, borderRadius: 16 }} />
        </div>
      ) : priceData ? (
        <>
          {/* Price Hero */}
          <div className="ad-price-hero container">
            <div className="ad-price-main">
              <span className="ad-current-price">
                {asset.isBond
                  ? `${priceData.price.toFixed(2)}%`
                  : formatCurrency(priceData.price)
                }
              </span>
              <span className={`ad-price-change ${isUp ? 'price-up' : 'price-down'}`}>
                {isUp ? '▲' : '▼'} {formatCurrency(Math.abs(priceData.change))} ({Math.abs(priceData.changePercent).toFixed(2)}%)
              </span>
            </div>

            {/* Data Quality Badge */}
            {priceData.dataQuality && (
              <div style={{
                marginTop: 8, display: 'flex', alignItems: 'center', gap: 8,
                fontSize: '0.65rem', color: 'var(--text-muted)',
              }}>
                <span style={{
                  padding: '2px 8px', borderRadius: 10, fontWeight: 600,
                  background: priceData.dataQuality.isReal ? 'var(--bullish-bg)' : 'rgba(239,68,68,0.1)',
                  color: priceData.dataQuality.isReal ? 'var(--bullish)' : '#ef4444',
                  fontSize: '0.58rem',
                }}>
                  {priceData.dataQuality.isReal ? '🟢' : '🔴'} {priceData.dataQuality.source}
                </span>
                <span style={{ opacity: 0.7 }}>
                  {new Date(priceData.dataQuality.lastUpdated).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>

          {/* Warning if data is not real */}
          {priceData.dataQuality && !priceData.dataQuality.isReal && (
            <div className="container" style={{ marginTop: 8 }}>
              <div style={{
                padding: '10px 14px', borderRadius: 12,
                background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)',
                fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5,
              }}>
                ⚠️ <strong style={{ color: '#ef4444' }}>Datos no confiables</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {priceData.dataQuality.reason}
                </p>
              </div>
            </div>
          )}

          {/* Candlestick Chart */}
          <div className="ad-chart-section container mt-md">
            <PeriodSelector activePeriod={period} onChange={setPeriod} />
            <div className="mt-sm" style={{ opacity: chartLoading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
              <CandlestickChart
                data={chartData}
                period={period}
                height={280}
              />
            </div>
            <p className="ad-chart-hint">Deslizá para moverte · Pellizca para zoom</p>
          </div>

          {/* Stats Grid */}
          <div className="ad-stats container mt-md">
            <div className="ad-stats-grid">
              {priceData.marketCap && (
                <div className="ad-stat glass-card">
                  <span className="ad-stat-label">Cap. Mercado</span>
                  <span className="ad-stat-value">{formatCurrency(priceData.marketCap)}</span>
                </div>
              )}
              {priceData.volume > 0 && (
                <div className="ad-stat glass-card">
                  <span className="ad-stat-label">Volumen 24h</span>
                  <span className="ad-stat-value">{formatNumber(priceData.volume)}</span>
                </div>
              )}
              {priceData.high24h > 0 && (
                <div className="ad-stat glass-card">
                  <span className="ad-stat-label">Máximo 24h</span>
                  <span className="ad-stat-value price-up">{formatCurrency(priceData.high24h)}</span>
                </div>
              )}
              {priceData.low24h > 0 && (
                <div className="ad-stat glass-card">
                  <span className="ad-stat-label">Mínimo 24h</span>
                  <span className="ad-stat-value price-down">{formatCurrency(priceData.low24h)}</span>
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis Panel */}
          <AIAnalysis analysis={aiAnalysis} ticker={asset.ticker} />

          {/* Asset News */}
          <AssetNews asset={asset} />

          {/* About */}
          {asset.description && (
            <div className="ad-about container mt-md">
              <h3 className="section-title" style={{ marginBottom: 10 }}>
                <Info size={16} /> Sobre {asset.name}
              </h3>
              <div className="glass-card" style={{ padding: 14 }}>
                <p className="ad-about-text">{asset.description}</p>
                {asset.sector && (
                  <div className="ad-about-sector mt-sm">
                    <span className="ad-about-sector-label">Sector:</span> {asset.sector}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="disclaimer">
            <strong>⚠️ Aviso:</strong> Los datos e indicadores mostrados son solo informativos y educativos.
            No constituyen asesoramiento financiero. Consultá con un profesional antes de invertir.
          </div>
        </>
      ) : (
        <div className="container" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          <p>No se pudieron cargar los datos de este activo.</p>
          <button className="btn btn-primary mt-md" onClick={onBack}>Volver</button>
        </div>
      )}

      <style>{`
        .asset-detail {
          padding-bottom: 20px;
        }

        .ad-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(10, 14, 23, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
        }

        .ad-back-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid var(--border-glass);
          background: var(--bg-glass);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .ad-back-btn:hover {
          background: var(--bg-card-hover);
          color: var(--accent-cyan);
        }

        .ad-header-info {
          flex: 1;
          min-width: 0;
        }

        .ad-header-name {
          font-size: 1rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ad-header-meta {
          font-size: 0.68rem;
          color: var(--text-muted);
          margin-top: 1px;
        }

        .ad-header-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .ad-fav-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid var(--border-glass);
          background: var(--bg-glass);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .ad-fav-btn:hover {
          color: #f59e0b;
          border-color: rgba(245, 158, 11, 0.3);
        }

        .ad-fav-active {
          color: #f59e0b;
          border-color: rgba(245, 158, 11, 0.25);
          background: rgba(245, 158, 11, 0.08);
        }

        .ad-price-hero {
          padding-top: 16px;
          padding-bottom: 4px;
        }

        .ad-current-price {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
          display: block;
        }

        .ad-price-change {
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 4px;
          display: inline-block;
        }

        .ad-chart-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ad-chart-hint {
          text-align: center;
          font-size: 0.58rem;
          color: var(--text-muted);
          opacity: 0.6;
        }

        .ad-period-badge {
          font-size: 0.62rem;
          color: var(--accent-cyan);
          font-weight: 500;
          margin-left: 8px;
          text-transform: none;
        }

        .ad-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .ad-stat {
          padding: 12px;
          text-align: center;
        }

        .ad-stat:hover {
          transform: none;
        }

        .ad-stat-label {
          font-size: 0.6rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 4px;
        }

        .ad-stat-value {
          font-size: 0.85rem;
          font-weight: 700;
        }

        .ad-indicators-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .ad-ind {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ad-ind-label {
          font-size: 0.62rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ad-ind-value {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .ad-recommendation {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
        }

        .ad-rec-desc {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .ad-outlook-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.6;
          font-style: italic;
        }

        .ad-about-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .ad-about-sector {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .ad-about-sector-label {
          font-weight: 600;
          color: var(--accent-purple);
        }
      `}</style>
    </div>
  );
}
