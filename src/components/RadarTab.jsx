import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Crosshair, Trophy, TrendingDown, Rocket, AlertTriangle, Zap,
  ChevronRight, Activity, RefreshCw
} from 'lucide-react';
import assetCatalog from '../data/assetCatalog';
import { fetchAssetPrice } from '../services/assetService';
import { analyzeRadar } from '../utils/radarEngine';

const categoryColors = {
  crypto: 'var(--accent-cyan)', acciones: 'var(--accent-indigo)',
  cedears: 'var(--accent-purple)', indices: 'var(--neutral)',
  etfs: 'var(--bullish)', bonos: '#f472b6',
};

const categoryLabels = {
  crypto: 'Crypto', acciones: 'Acción', cedears: 'CEDEAR',
  indices: 'Índice', etfs: 'ETF', bonos: 'Bono',
};

const SECTIONS = [
  { id: 'opportunities', title: 'Top Oportunidades', icon: Trophy, color: '#22c55e', desc: 'Mejor combinación técnica del momento' },
  { id: 'oversold', title: 'Sobrevendidos Extremos', icon: TrendingDown, color: '#06b6d4', desc: 'RSI bajo con posible rebote técnico' },
  { id: 'momentum', title: 'Momentum Fuerte', icon: Rocket, color: '#a855f7', desc: 'Activos con inercia alcista activa' },
  { id: 'risk', title: 'Riesgo Alto', icon: AlertTriangle, color: '#ef4444', desc: 'Señales de debilidad técnica' },
  { id: 'signals', title: 'Señales Destacadas', icon: Zap, color: '#f59e0b', desc: 'Alertas técnicas del momento' },
];

export default function RadarTab({ onSelectAsset, settings }) {
  const [priceCache, setPriceCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null); // null = all

  // Load prices for all assets on mount
  const loadPrices = useCallback(async () => {
    setLoading(true);
    const newCache = {};
    const batchSize = 10;

    for (let i = 0; i < assetCatalog.length; i += batchSize) {
      const batch = assetCatalog.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (asset) => {
          try {
            const data = await fetchAssetPrice(asset, settings);
            return { id: asset.id, data };
          } catch {
            return { id: asset.id, data: null };
          }
        })
      );
      results.forEach(({ id, data }) => {
        if (data) newCache[id] = data;
      });
    }

    setPriceCache(newCache);
    setLoading(false);
  }, [settings]);

  useEffect(() => { loadPrices(); }, []);

  // Run radar analysis
  const radar = useMemo(() => {
    if (Object.keys(priceCache).length === 0) return null;
    return analyzeRadar(assetCatalog, priceCache);
  }, [priceCache]);

  if (loading || !radar) {
    return (
      <div className="radar-tab container mt-md">
        <div className="section-header">
          <h2 className="section-title"><Crosshair size={18} /> Radar IA</h2>
          <span className="section-subtitle">Analizando...</span>
        </div>
        <div className="rt-loading">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: 80, marginBottom: 8, borderRadius: 14 }} />
          ))}
        </div>
        <style>{radarStyles}</style>
      </div>
    );
  }

  const visibleSections = activeSection
    ? SECTIONS.filter(s => s.id === activeSection)
    : SECTIONS;

  const noValidAssets = radar.totalAnalyzed === 0;

  return (
    <div className="radar-tab container mt-md">
      {/* Header */}
      <div className="section-header">
        <h2 className="section-title"><Crosshair size={18} /> Radar IA</h2>
        <span className="section-subtitle">
          {radar.totalAnalyzed} analizados
          {radar.totalSkipped > 0 && (
            <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>
              · {radar.totalSkipped} excluidos
            </span>
          )}
        </span>
      </div>

      {/* Data quality info */}
      {radar.totalSkipped > 0 && (
        <div style={{
          padding: '8px 12px', marginBottom: 12, borderRadius: 10,
          background: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.15)',
          fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.5,
        }}>
          ℹ️ Se excluyeron {radar.totalSkipped} activos sin datos reales o actualizados.
          Solo se analizan activos con datos confiables y frescos.
        </div>
      )}

      {/* No valid assets warning */}
      {noValidAssets && (
        <div style={{
          padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)',
          background: 'var(--bg-glass)', borderRadius: 14, border: '1px solid var(--border-glass)',
        }}>
          <Crosshair size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
          <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
            No hay suficientes activos con datos confiables
          </p>
          <p style={{ fontSize: '0.72rem' }}>
            El radar necesita datos reales y actualizados. Revisá tu conexión o configurá API keys en ⚙️.
          </p>
        </div>
      )}

      {/* Section Nav */}
      {!noValidAssets && (
        <div className="rt-nav">
          <button
            className={`rt-nav-btn ${!activeSection ? 'active' : ''}`}
            onClick={() => setActiveSection(null)}
          >
            Todo
          </button>
          {SECTIONS.map(sec => (
            <button
              key={sec.id}
              className={`rt-nav-btn ${activeSection === sec.id ? 'active' : ''}`}
              onClick={() => setActiveSection(activeSection === sec.id ? null : sec.id)}
              style={activeSection === sec.id ? { borderColor: sec.color, color: sec.color } : {}}
            >
              <sec.icon size={11} /> {sec.title.split(' ')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Radar Blocks */}
      {visibleSections.map(section => {
        const items = radar[section.id] || [];
        if (items.length === 0) return null;

        return (
          <div key={section.id} className="rt-block fade-in-up">
            <div className="rt-block-header">
              <div className="rt-block-icon" style={{ background: `${section.color}15`, color: section.color }}>
                <section.icon size={16} />
              </div>
              <div className="rt-block-info">
                <h3 className="rt-block-title">{section.title}</h3>
                <p className="rt-block-desc">{section.desc}</p>
              </div>
              <span className="rt-block-count">{items.length}</span>
            </div>

            <div className="rt-cards">
              {items.map((item, i) => (
                <button
                  key={item.asset.ticker}
                  className="rt-card glass-card"
                  onClick={() => onSelectAsset(item.asset)}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="rt-card-top">
                    <div className="rt-card-asset">
                      {item.asset.image ? (
                        <img src={item.asset.image} alt="" className="rt-card-icon" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                      ) : null}
                      <div className="rt-card-icon-fb" style={{
                        display: item.asset.image ? 'none' : 'flex',
                        background: `${categoryColors[item.asset.category]}15`,
                        color: categoryColors[item.asset.category],
                      }}>
                        {item.asset.ticker.slice(0, 2)}
                      </div>
                      <div className="rt-card-name-col">
                        <span className="rt-card-name">{item.asset.name}</span>
                        <div className="rt-card-meta">
                          <span className="rt-card-ticker">{item.asset.ticker}</span>
                          <span className="rt-card-cat-dot" style={{ background: categoryColors[item.asset.category] }} />
                          <span className="rt-card-cat">{categoryLabels[item.asset.category]}</span>
                        </div>
                      </div>
                    </div>
                    <div className="rt-card-price-col">
                      <span className="rt-card-price">
                        {item.asset.isBond
                          ? `${item.priceData.price.toFixed(2)}%`
                          : `$${item.priceData.price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        }
                      </span>
                      <span className={`rt-card-change ${item.metrics.changePercent >= 0 ? 'price-up' : 'price-down'}`}>
                        {item.metrics.changePercent >= 0 ? '▲' : '▼'} {Math.abs(item.metrics.changePercent).toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="rt-card-indicators">
                    <div className="rt-indicator">
                      <span className="rt-ind-label">RSI</span>
                      <span className={`rt-ind-value ${
                        item.metrics.rsi < 30 ? 'rt-val-low' :
                        item.metrics.rsi > 70 ? 'rt-val-high' : 'rt-val-mid'
                      }`}>{item.metrics.rsi.toFixed(0)}</span>
                    </div>
                    <div className="rt-indicator">
                      <span className="rt-ind-label">Score</span>
                      <span className={`rt-ind-value ${
                        item.metrics.totalScore >= 60 ? 'rt-val-low' :
                        item.metrics.totalScore < 40 ? 'rt-val-high' : 'rt-val-mid'
                      }`}>{item.metrics.totalScore}</span>
                    </div>
                    {item.metrics.signals.length > 0 && (
                      <div className="rt-indicator">
                        <span className="rt-ind-label">Señales</span>
                        <span className="rt-ind-value rt-val-mid">{item.metrics.signals.length}</span>
                      </div>
                    )}
                    <ChevronRight size={14} className="rt-card-chevron" />
                  </div>

                  <p className="rt-card-explanation">{item.explanation}</p>

                  {/* Data source badge */}
                  {item.priceData?.dataQuality && (
                    <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        fontSize: '0.5rem', color: 'var(--bullish)', fontWeight: 600,
                        background: 'var(--bullish-bg)', padding: '2px 6px', borderRadius: 10,
                      }}>
                        📡 {item.priceData.dataQuality.source}
                      </span>
                    </div>
                  )}

                  {item.metrics.signals.length > 0 && section.id === 'signals' && (
                    <div className="rt-card-signals">
                      {item.metrics.signals.slice(0, 3).map((sig, si) => (
                        <span key={si} className={`rt-signal-chip ${sig.impact === 'alcista' ? 'rt-sig-up' : 'rt-sig-down'}`}>
                          {sig.text}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <style>{radarStyles}</style>
    </div>
  );
}

const radarStyles = `
  .radar-tab {
    padding-bottom: 20px;
  }

  .rt-loading {
    margin-top: 12px;
  }

  .rt-nav {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 8px;
    margin-bottom: 14px;
    scrollbar-width: none;
  }

  .rt-nav::-webkit-scrollbar { display: none; }

  .rt-nav-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-glass);
    background: var(--bg-glass);
    color: var(--text-muted);
    font-family: 'Inter', sans-serif;
    font-size: 0.62rem;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .rt-nav-btn:hover {
    border-color: var(--accent-cyan);
    color: var(--text-secondary);
  }

  .rt-nav-btn.active {
    background: linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan));
    border-color: transparent;
    color: white;
    font-weight: 600;
  }

  /* Block */
  .rt-block {
    margin-bottom: 20px;
  }

  .rt-block-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .rt-block-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .rt-block-info {
    flex: 1;
  }

  .rt-block-title {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .rt-block-desc {
    font-size: 0.62rem;
    color: var(--text-muted);
    margin-top: 1px;
  }

  .rt-block-count {
    font-size: 0.6rem;
    font-weight: 700;
    color: var(--text-muted);
    background: var(--bg-glass);
    border: 1px solid var(--border-glass);
    padding: 2px 8px;
    border-radius: var(--radius-full);
  }

  /* Cards */
  .rt-cards {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .rt-card {
    display: block;
    width: 100%;
    padding: 12px;
    text-align: left;
    border: none;
    cursor: pointer;
    font-family: inherit;
    color: inherit;
    transition: all 0.2s;
  }

  .rt-card:hover {
    border-color: var(--accent-cyan);
  }

  .rt-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .rt-card-asset {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
  }

  .rt-card-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .rt-card-icon-fb {
    width: 28px;
    height: 28px;
    min-width: 28px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    font-size: 0.58rem;
    font-weight: 800;
  }

  .rt-card-name-col {
    min-width: 0;
  }

  .rt-card-name {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text-primary);
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 130px;
  }

  .rt-card-meta {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 1px;
  }

  .rt-card-ticker {
    font-size: 0.58rem;
    color: var(--text-muted);
    font-weight: 600;
  }

  .rt-card-cat-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
  }

  .rt-card-cat {
    font-size: 0.55rem;
    color: var(--text-muted);
  }

  .rt-card-price-col {
    text-align: right;
    flex-shrink: 0;
  }

  .rt-card-price {
    font-size: 0.78rem;
    font-weight: 700;
    display: block;
  }

  .rt-card-change {
    font-size: 0.62rem;
    font-weight: 600;
  }

  /* Indicators row */
  .rt-card-indicators {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 6px;
  }

  .rt-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .rt-ind-label {
    font-size: 0.55rem;
    color: var(--text-muted);
    text-transform: uppercase;
    font-weight: 600;
  }

  .rt-ind-value {
    font-size: 0.68rem;
    font-weight: 700;
  }

  .rt-val-low { color: var(--bullish); }
  .rt-val-high { color: var(--bearish); }
  .rt-val-mid { color: #f59e0b; }

  .rt-card-chevron {
    margin-left: auto;
    color: var(--text-muted);
    opacity: 0.4;
    flex-shrink: 0;
  }

  /* Explanation */
  .rt-card-explanation {
    font-size: 0.68rem;
    color: var(--text-muted);
    line-height: 1.5;
    font-style: italic;
    padding-left: 2px;
  }

  /* Signal chips */
  .rt-card-signals {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 6px;
  }

  .rt-signal-chip {
    padding: 2px 8px;
    border-radius: var(--radius-full);
    font-size: 0.52rem;
    font-weight: 600;
  }

  .rt-sig-up {
    background: var(--bullish-bg);
    color: var(--bullish);
  }

  .rt-sig-down {
    background: var(--bearish-bg);
    color: var(--bearish);
  }
`;
