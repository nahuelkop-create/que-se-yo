import { TrendingUp, TrendingDown, Minus, BarChart2 } from 'lucide-react';
import { analyzeAsset, formatCurrency, generateOutlook } from '../utils/analysis';

export default function StockCard({ stock, index, onShowChart }) {
  const analysis = analyzeAsset(stock.priceHistory);
  const isUp = analysis.changePercent >= 0;

  const trendIcon = {
    alcista: <TrendingUp size={12} />,
    bajista: <TrendingDown size={12} />,
    neutral: <Minus size={12} />,
  };

  const trendLabel = {
    alcista: 'Alcista',
    bajista: 'Bajista',
    neutral: 'Neutral',
  };

  const outlook = generateOutlook(
    stock.symbol,
    analysis.trend,
    analysis.rsi,
    analysis.changePercent
  );

  return (
    <div className="stock-card glass-card fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="stock-card-header">
        <div className="stock-id">
          <div className={`stock-symbol-badge ${isUp ? 'up' : 'down'}`}>
            {stock.symbol}
          </div>
          <div>
            <h3 className="stock-name">{stock.name}</h3>
            <span className={`stock-change ${isUp ? 'price-up' : 'price-down'}`}>
              {isUp ? '▲' : '▼'} {Math.abs(analysis.changePercent).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="stock-price-area">
          <span className="stock-price">{formatCurrency(analysis.currentPrice)}</span>
          <button className="chart-btn" onClick={() => onShowChart?.(stock)} title="Ver gráfico">
            <BarChart2 size={16} />
          </button>
        </div>
      </div>

      <div className="stock-indicators">
        <div className="indicator">
          <span className="ind-label">SMA 20</span>
          <span className="ind-value">{analysis.sma20 ? formatCurrency(analysis.sma20) : '—'}</span>
        </div>
        <div className="indicator">
          <span className="ind-label">SMA 50</span>
          <span className="ind-value">{analysis.sma50 ? formatCurrency(analysis.sma50) : '—'}</span>
        </div>
        <div className="indicator">
          <span className="ind-label">RSI</span>
          <span className={`ind-value ${analysis.rsi >= 70 ? 'price-down' : analysis.rsi <= 30 ? 'price-up' : ''}`}>
            {analysis.rsi ?? '—'}
          </span>
        </div>
        <div className="indicator">
          <span className="ind-label">Tendencia</span>
          <span className={`badge badge-${analysis.trend === 'alcista' ? 'bullish' : analysis.trend === 'bajista' ? 'bearish' : 'neutral'}`}>
            {trendIcon[analysis.trend]} {trendLabel[analysis.trend]}
          </span>
        </div>
      </div>

      <div className="stock-recommendation">
        <div className={`rec-badge badge-${analysis.recommendation.color}`}>
          {analysis.recommendation.signal}
        </div>
        <p className="rec-desc">{analysis.recommendation.description}</p>
      </div>

      <p className="stock-outlook">{outlook}</p>

      <style>{`
        .stock-card {
          padding: 14px;
          margin-bottom: 10px;
        }

        .stock-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .stock-id {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stock-symbol-badge {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 6px 8px;
          border-radius: 8px;
          letter-spacing: 0.05em;
        }

        .stock-symbol-badge.up {
          background: var(--bullish-bg);
          color: var(--bullish);
        }

        .stock-symbol-badge.down {
          background: var(--bearish-bg);
          color: var(--bearish);
        }

        .stock-name {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .stock-change {
          font-size: 0.7rem;
          font-weight: 600;
        }

        .stock-price-area {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stock-price {
          font-size: 1.05rem;
          font-weight: 700;
        }

        .chart-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 1px solid var(--border-glass);
          background: var(--bg-glass);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chart-btn:hover {
          color: var(--accent-cyan);
          border-color: rgba(6, 182, 212, 0.3);
        }

        .stock-indicators {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          padding: 10px 0;
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }

        .indicator {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: center;
        }

        .ind-label {
          font-size: 0.6rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ind-value {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .stock-recommendation {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
        }

        .rec-badge {
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .rec-badge.badge-bullish {
          background: var(--bullish-bg);
          color: var(--bullish);
        }

        .rec-badge.badge-bearish {
          background: var(--bearish-bg);
          color: var(--bearish);
        }

        .rec-badge.badge-neutral {
          background: var(--neutral-bg);
          color: var(--neutral);
        }

        .rec-desc {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .stock-outlook {
          font-size: 0.72rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px dashed var(--border-subtle);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
