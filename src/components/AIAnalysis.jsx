import { Brain, TrendingUp, TrendingDown, Minus, ShieldCheck, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../utils/analysis';

export default function AIAnalysis({ analysis, ticker }) {
  if (!analysis) return null;

  // No data state
  if (!analysis.hasData) {
    return (
      <div className="ai-analysis container mt-md">
        <h3 className="section-title" style={{ marginBottom: 10 }}>
          <Brain size={16} /> Análisis IA
          <span className="ai-period-label">{analysis.periodLabel}</span>
        </h3>
        <div className="glass-card ai-nodata">
          <p>{analysis.message}</p>
        </div>
      </div>
    );
  }

  const trendConfig = {
    alcista: { icon: <TrendingUp size={16} />, label: 'Alcista', color: 'var(--bullish)', bg: 'var(--bullish-bg)' },
    bajista: { icon: <TrendingDown size={16} />, label: 'Bajista', color: 'var(--bearish)', bg: 'var(--bearish-bg)' },
    neutral: { icon: <Minus size={16} />, label: 'Lateral', color: 'var(--neutral)', bg: 'rgba(245, 158, 11, 0.1)' },
  };

  const recConfig = {
    bullish: { gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(16, 185, 129, 0.04))', border: 'rgba(16, 185, 129, 0.25)' },
    bearish: { gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(239, 68, 68, 0.04))', border: 'rgba(239, 68, 68, 0.25)' },
    neutral: { gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.04))', border: 'rgba(245, 158, 11, 0.25)' },
  };

  const tc = trendConfig[analysis.trend] || trendConfig.neutral;
  const rc = recConfig[analysis.recommendation.color] || recConfig.neutral;

  return (
    <div className="ai-analysis container mt-md fade-in-up">
      <h3 className="section-title" style={{ marginBottom: 10 }}>
        <Brain size={16} /> Análisis IA
        <span className="ai-period-label">{analysis.periodLabel}</span>
      </h3>

      <div className="ai-panel glass-card">
        {/* Trend + Recommendation Header */}
        <div className="ai-header-row">
          <div className="ai-trend-chip" style={{ background: tc.bg, color: tc.color }}>
            {tc.icon}
            <span>Tendencia {tc.label}</span>
          </div>
          <div className="ai-rec-chip" style={{ background: rc.gradient, borderColor: rc.border }}>
            <span className="ai-rec-icon">{analysis.recommendation.icon}</span>
            <span className="ai-rec-action">{analysis.recommendation.action}</span>
          </div>
        </div>

        {/* Indicators Grid */}
        <div className="ai-grid">
          {/* RSI */}
          <div className="ai-grid-item">
            <div className="ai-grid-header">
              <span className="ai-grid-label">RSI (14)</span>
              <span className={`ai-grid-value ${analysis.rsiInterpretation.color === 'bullish' ? 'price-up' : analysis.rsiInterpretation.color === 'bearish' ? 'price-down' : ''}`}>
                {analysis.rsi ?? '—'}
              </span>
            </div>
            {analysis.rsi !== null && (
              <div className="ai-rsi-bar">
                <div className="ai-rsi-track">
                  <div className="ai-rsi-zone ai-rsi-oversold" />
                  <div className="ai-rsi-zone ai-rsi-neutral" />
                  <div className="ai-rsi-zone ai-rsi-overbought" />
                </div>
                <div className="ai-rsi-marker" style={{ left: `${Math.min(100, Math.max(0, analysis.rsi))}%` }} />
              </div>
            )}
            <p className="ai-grid-text">{analysis.rsiInterpretation.text}</p>
          </div>

          {/* SMA */}
          <div className="ai-grid-item">
            <div className="ai-grid-header">
              <span className="ai-grid-label">Medias Móviles</span>
            </div>
            <div className="ai-sma-values">
              <span className="ai-sma-item">
                <span className="ai-sma-dot" style={{ background: '#8b5cf6' }} />
                SMA 20: {analysis.sma20 ? formatCurrency(analysis.sma20) : '—'}
              </span>
              <span className="ai-sma-item">
                <span className="ai-sma-dot" style={{ background: '#f59e0b' }} />
                SMA 50: {analysis.sma50 ? formatCurrency(analysis.sma50) : '—'}
              </span>
            </div>
            <p className="ai-grid-text">{analysis.smaInterpretation.text}</p>
          </div>
        </div>

        {/* Support & Resistance */}
        {(analysis.support || analysis.resistance) && (
          <div className="ai-sr-section">
            <div className="ai-sr-row">
              {analysis.support && (
                <div className="ai-sr-item ai-sr-support">
                  <ShieldCheck size={13} />
                  <span className="ai-sr-label">Soporte</span>
                  <span className="ai-sr-value">{formatCurrency(analysis.support)}</span>
                </div>
              )}
              {analysis.resistance && (
                <div className="ai-sr-item ai-sr-resistance">
                  <Target size={13} />
                  <span className="ai-sr-label">Resistencia</span>
                  <span className="ai-sr-value">{formatCurrency(analysis.resistance)}</span>
                </div>
              )}
            </div>
            <p className="ai-grid-text">{analysis.srInterpretation.text}</p>
          </div>
        )}

        {/* Estimation */}
        <div className="ai-estimate-section">
          <div className="ai-grid-header">
            <span className="ai-grid-label">Estimación para {analysis.futureLabel}</span>
            <span className="ai-confidence">Confianza: {analysis.estimate.confidence}%</span>
          </div>
          <div className="ai-estimate-bars">
            <div className="ai-estimate-item ai-estimate-up">
              <ArrowUpRight size={14} />
              <span className="ai-estimate-label">Alza</span>
              <div className="ai-estimate-bar-track">
                <div className="ai-estimate-bar-fill ai-bar-up" style={{ width: `${Math.min(100, analysis.estimate.upside * 10)}%` }} />
              </div>
              <span className="ai-estimate-pct">+{analysis.estimate.upside}%</span>
            </div>
            <div className="ai-estimate-item ai-estimate-down">
              <ArrowDownRight size={14} />
              <span className="ai-estimate-label">Baja</span>
              <div className="ai-estimate-bar-track">
                <div className="ai-estimate-bar-fill ai-bar-down" style={{ width: `${Math.min(100, analysis.estimate.downside * 10)}%` }} />
              </div>
              <span className="ai-estimate-pct">-{analysis.estimate.downside}%</span>
            </div>
          </div>
        </div>

        {/* Recommendation Box */}
        <div className="ai-rec-box" style={{ background: rc.gradient, borderColor: rc.border }}>
          <div className="ai-rec-box-header">
            <span className="ai-rec-box-icon">{analysis.recommendation.icon}</span>
            <span className="ai-rec-box-title">Recomendación: {analysis.recommendation.action}</span>
          </div>
          <p className="ai-rec-box-text">{analysis.recommendation.text}</p>
        </div>

        {/* Short-term vs Long-term Views */}
        {analysis.shortTermView && analysis.longTermView && (
          <div className="ai-dual-views">
            <div className="ai-view-card">
              <div className="ai-view-header">
                <span className="ai-view-label">⚡ Corto Plazo</span>
                <span className={`ai-view-signal ai-view-${analysis.shortTermView.signalColor}`}>
                  {analysis.shortTermView.signal}
                </span>
              </div>
              <p className="ai-view-text">{analysis.shortTermView.text}</p>
            </div>
            <div className="ai-view-card">
              <div className="ai-view-header">
                <span className="ai-view-label">🏦 Largo Plazo</span>
                <span className={`ai-view-signal ai-view-${analysis.longTermView.signalColor}`}>
                  {analysis.longTermView.signal}
                </span>
              </div>
              <p className="ai-view-text">{analysis.longTermView.text}</p>
            </div>
          </div>
        )}

        {/* Context Text */}
        <div className="ai-context">
          <p className="ai-context-text">{analysis.contextText}</p>
        </div>
      </div>

      <style>{`
        .ai-period-label {
          font-size: 0.62rem;
          color: var(--accent-cyan);
          font-weight: 500;
          margin-left: 8px;
          text-transform: none;
        }

        .ai-panel {
          padding: 16px;
        }

        .ai-panel:hover {
          transform: none;
        }

        .ai-nodata {
          padding: 20px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.8rem;
        }

        .ai-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .ai-trend-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 600;
        }

        .ai-rec-chip {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          border: 1px solid;
          font-size: 0.72rem;
          font-weight: 700;
        }

        .ai-rec-icon {
          font-size: 0.85rem;
        }

        .ai-rec-action {
          color: var(--text-primary);
        }

        .ai-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 14px;
        }

        .ai-grid-item {
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .ai-grid-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .ai-grid-label {
          font-size: 0.68rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .ai-grid-value {
          font-size: 0.85rem;
          font-weight: 700;
        }

        .ai-grid-text {
          font-size: 0.72rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-top: 6px;
        }

        /* RSI Bar */
        .ai-rsi-bar {
          position: relative;
          height: 6px;
          margin: 8px 0 4px;
        }

        .ai-rsi-track {
          display: flex;
          height: 100%;
          border-radius: 3px;
          overflow: hidden;
        }

        .ai-rsi-zone {
          flex: 1;
        }

        .ai-rsi-oversold {
          background: linear-gradient(90deg, rgba(16, 185, 129, 0.4), rgba(16, 185, 129, 0.1));
        }

        .ai-rsi-neutral {
          background: rgba(245, 158, 11, 0.15);
        }

        .ai-rsi-overbought {
          background: linear-gradient(90deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.4));
        }

        .ai-rsi-marker {
          position: absolute;
          top: -2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--text-primary);
          border: 2px solid var(--bg-primary);
          transform: translateX(-50%);
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
        }

        /* SMA Values */
        .ai-sma-values {
          display: flex;
          gap: 16px;
        }

        .ai-sma-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .ai-sma-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        /* Support & Resistance */
        .ai-sr-section {
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          margin-bottom: 14px;
        }

        .ai-sr-row {
          display: flex;
          gap: 10px;
        }

        .ai-sr-item {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .ai-sr-support {
          background: var(--bullish-bg);
          color: var(--bullish);
        }

        .ai-sr-resistance {
          background: var(--bearish-bg);
          color: var(--bearish);
        }

        .ai-sr-label {
          opacity: 0.8;
          flex-shrink: 0;
        }

        .ai-sr-value {
          margin-left: auto;
          font-weight: 700;
        }

        /* Estimation */
        .ai-estimate-section {
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          margin-bottom: 14px;
        }

        .ai-confidence {
          font-size: 0.6rem;
          color: var(--accent-purple);
          font-weight: 500;
        }

        .ai-estimate-bars {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ai-estimate-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ai-estimate-up {
          color: var(--bullish);
        }

        .ai-estimate-down {
          color: var(--bearish);
        }

        .ai-estimate-label {
          font-size: 0.65rem;
          font-weight: 600;
          width: 30px;
          flex-shrink: 0;
        }

        .ai-estimate-bar-track {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 3px;
          overflow: hidden;
        }

        .ai-estimate-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .ai-bar-up {
          background: linear-gradient(90deg, var(--bullish), rgba(16, 185, 129, 0.4));
        }

        .ai-bar-down {
          background: linear-gradient(90deg, var(--bearish), rgba(239, 68, 68, 0.4));
        }

        .ai-estimate-pct {
          font-size: 0.75rem;
          font-weight: 700;
          width: 45px;
          text-align: right;
          flex-shrink: 0;
        }

        /* Recommendation Box */
        .ai-rec-box {
          padding: 14px;
          border-radius: var(--radius-md);
          border: 1px solid;
          margin-bottom: 14px;
        }

        .ai-rec-box-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .ai-rec-box-icon {
          font-size: 1.1rem;
        }

        .ai-rec-box-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .ai-rec-box-text {
          font-size: 0.72rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Context */
        .ai-context {
          padding: 12px;
          background: rgba(99, 102, 241, 0.04);
          border-radius: var(--radius-md);
          border: 1px solid rgba(99, 102, 241, 0.1);
        }

        .ai-context-text {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.65;
          font-style: italic;
        }

        /* Dual Views (Short/Long Term) */
        .ai-dual-views {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 14px;
        }

        .ai-view-card {
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .ai-view-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .ai-view-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .ai-view-signal {
          font-size: 0.6rem;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .ai-view-bullish {
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
        }

        .ai-view-bearish {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
        }

        .ai-view-neutral {
          background: rgba(245, 158, 11, 0.12);
          color: #f59e0b;
        }

        .ai-view-text {
          font-size: 0.72rem;
          color: var(--text-muted);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
