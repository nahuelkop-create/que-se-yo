import { Activity } from 'lucide-react';
import { analyzeAsset } from '../utils/analysis';

function RSIGauge({ value }) {
  if (value === null || value === undefined) return <span className="gauge-na">N/A</span>;
  
  const angle = (value / 100) * 180 - 90;
  const isOverbought = value >= 70;
  const isOversold = value <= 30;
  const color = isOverbought ? 'var(--bearish)' : isOversold ? 'var(--bullish)' : 'var(--accent-cyan)';
  
  return (
    <div className="rsi-gauge">
      <svg viewBox="0 0 120 70" width="100%" height="60">
        {/* Background arc */}
        <path
          d="M 10 65 A 50 50 0 0 1 110 65"
          fill="none"
          stroke="var(--bg-primary)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Oversold zone (green) */}
        <path
          d="M 10 65 A 50 50 0 0 1 28 25"
          fill="none"
          stroke="rgba(16, 185, 129, 0.3)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Overbought zone (red) */}
        <path
          d="M 92 25 A 50 50 0 0 1 110 65"
          fill="none"
          stroke="rgba(239, 68, 68, 0.3)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Needle */}
        <line
          x1="60"
          y1="65"
          x2={60 + 35 * Math.cos((angle * Math.PI) / 180)}
          y2={65 - 35 * Math.sin((angle * Math.PI) / 180)}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="60" cy="65" r="4" fill={color} />
      </svg>
      <div className="rsi-value" style={{ color }}>
        {value.toFixed(0)}
      </div>
      <div className="rsi-label">
        {isOverbought ? 'Sobrecomprado' : isOversold ? 'Sobrevendido' : 'Neutral'}
      </div>
    </div>
  );
}

export default function TechnicalPanel({ cryptoData, stockData }) {
  const allAssets = [
    ...(cryptoData || []).map(c => ({
      name: c.symbol,
      type: 'Crypto',
      ...analyzeAsset(c.priceHistory, c.current_price),
    })),
    ...(stockData || []).map(s => ({
      name: s.symbol,
      type: 'Acción',
      ...analyzeAsset(s.priceHistory),
    })),
  ];

  return (
    <div className="tech-panel fade-in-up">
      <div className="section-header">
        <h2 className="section-title">
          <Activity size={18} /> Panel Técnico
        </h2>
      </div>

      <div className="tech-gauges container">
        {allAssets.map((asset) => (
          <div key={asset.name} className="tech-gauge-card glass-card">
            <h4 className="gauge-title">{asset.name}</h4>
            <span className="gauge-type">{asset.type}</span>
            <RSIGauge value={asset.rsi} />
          </div>
        ))}
      </div>

      <div className="tech-table-container container mt-md">
        <div className="glass-card" style={{ padding: 14, overflow: 'auto' }}>
          <table className="tech-table">
            <thead>
              <tr>
                <th>Activo</th>
                <th>Precio</th>
                <th>SMA20</th>
                <th>SMA50</th>
                <th>RSI</th>
                <th>Señal</th>
              </tr>
            </thead>
            <tbody>
              {allAssets.map((asset) => (
                <tr key={asset.name}>
                  <td className="asset-name">{asset.name}</td>
                  <td>${asset.currentPrice?.toFixed(2)}</td>
                  <td>{asset.sma20?.toFixed(2) || '—'}</td>
                  <td>{asset.sma50?.toFixed(2) || '—'}</td>
                  <td className={
                    asset.rsi >= 70 ? 'price-down' : asset.rsi <= 30 ? 'price-up' : ''
                  }>
                    {asset.rsi ?? '—'}
                  </td>
                  <td>
                    <span className={`badge badge-${asset.recommendation?.color || 'neutral'}`}>
                      {asset.recommendation?.signal || '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .tech-gauges {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .tech-gauge-card {
          padding: 12px 8px;
          text-align: center;
        }

        .gauge-title {
          font-size: 0.85rem;
          font-weight: 700;
        }

        .gauge-type {
          font-size: 0.6rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .gauge-na {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .rsi-gauge {
          margin-top: 4px;
        }

        .rsi-value {
          font-size: 1.1rem;
          font-weight: 800;
          margin-top: -4px;
          text-align: center;
        }

        .rsi-label {
          font-size: 0.58rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-top: 2px;
        }

        .tech-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.72rem;
        }

        .tech-table th {
          text-align: left;
          padding: 6px 8px;
          font-size: 0.6rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-subtle);
          white-space: nowrap;
        }

        .tech-table td {
          padding: 8px;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-subtle);
          white-space: nowrap;
        }

        .tech-table .asset-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .tech-table tr:last-child td {
          border-bottom: none;
        }

        @media (max-width: 400px) {
          .tech-gauges {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
