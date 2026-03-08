import { TrendingUp, TrendingDown, DollarSign, Zap } from 'lucide-react';
import { formatCurrency } from '../utils/analysis';

export default function PortfolioSummary({ cryptoData, stockData }) {
  // Calculate portfolio metrics from available data
  const allAssets = [
    ...(cryptoData || []).map(c => ({
      name: c.symbol,
      change: c.price_change_percentage_24h || 0,
      value: c.current_price || 0,
    })),
    ...(stockData || []).map(s => {
      const latest = s.priceHistory?.[s.priceHistory.length - 1];
      const prev = s.priceHistory?.[s.priceHistory.length - 2];
      const price = latest?.close || latest?.price || 0;
      const prevPrice = prev?.close || prev?.price || price;
      const change = prevPrice ? ((price - prevPrice) / prevPrice) * 100 : 0;
      return { name: s.symbol, change, value: price };
    }),
  ];

  const avgChange = allAssets.length > 0
    ? allAssets.reduce((sum, a) => sum + a.change, 0) / allAssets.length
    : 0;

  const topPerformer = allAssets.length > 0
    ? allAssets.reduce((best, a) => (a.change > best.change ? a : best), allAssets[0])
    : null;

  const worstPerformer = allAssets.length > 0
    ? allAssets.reduce((worst, a) => (a.change < worst.change ? a : worst), allAssets[0])
    : null;

  const totalAssets = allAssets.length;

  return (
    <div className="portfolio-summary">
      <div className="summary-header">
        <h2 className="summary-greeting">Resumen del Mercado</h2>
        <p className="summary-date">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <div className="summary-cards">
        <div className="summary-card main-card glass-card">
          <div className="card-icon" style={{ background: avgChange >= 0 ? 'var(--bullish-bg)' : 'var(--bearish-bg)' }}>
            {avgChange >= 0 ? <TrendingUp size={18} color="var(--bullish)" /> : <TrendingDown size={18} color="var(--bearish)" />}
          </div>
          <div className="card-content">
            <span className="card-label">Cambio Promedio</span>
            <span className={`card-value ${avgChange >= 0 ? 'price-up' : 'price-down'}`}>
              {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="summary-card glass-card">
          <div className="card-icon" style={{ background: 'rgba(99, 102, 241, 0.12)' }}>
            <DollarSign size={18} color="var(--accent-indigo)" />
          </div>
          <div className="card-content">
            <span className="card-label">Activos Monitoreados</span>
            <span className="card-value">{totalAssets}</span>
          </div>
        </div>

        <div className="summary-card glass-card">
          <div className="card-icon" style={{ background: 'var(--bullish-bg)' }}>
            <Zap size={18} color="var(--bullish)" />
          </div>
          <div className="card-content">
            <span className="card-label">Mejor Rendimiento</span>
            <span className="card-value price-up">
              {topPerformer ? `${topPerformer.name} +${topPerformer.change.toFixed(1)}%` : '—'}
            </span>
          </div>
        </div>

        <div className="summary-card glass-card">
          <div className="card-icon" style={{ background: 'var(--bearish-bg)' }}>
            <TrendingDown size={18} color="var(--bearish)" />
          </div>
          <div className="card-content">
            <span className="card-label">Mayor Caída</span>
            <span className="card-value price-down">
              {worstPerformer ? `${worstPerformer.name} ${worstPerformer.change.toFixed(1)}%` : '—'}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .portfolio-summary {
          padding: 16px;
          animation: fadeInUp 0.5s ease;
        }

        .summary-header {
          margin-bottom: 16px;
        }

        .summary-greeting {
          font-size: 1.3rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--text-primary), var(--accent-purple));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .summary-date {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: capitalize;
          margin-top: 2px;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .summary-card {
          padding: 14px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .summary-card.main-card {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.08));
          border-color: rgba(99, 102, 241, 0.2);
        }

        .card-icon {
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .card-label {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .card-value {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}
