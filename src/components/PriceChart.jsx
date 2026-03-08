import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { X } from 'lucide-react';
import { calcSMA } from '../utils/analysis';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="custom-tooltip">
      <p className="label">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="value" style={{ color: entry.stroke || entry.color }}>
          {entry.name}: ${parseFloat(entry.value).toFixed(2)}
        </p>
      ))}
    </div>
  );
}

export default function PriceChart({ stock, onClose }) {
  if (!stock || !stock.priceHistory || stock.priceHistory.length === 0) return null;

  const chartData = stock.priceHistory.map((d, i, arr) => {
    const sma20 = i >= 19 ? calcSMA(arr.slice(0, i + 1), 20) : null;
    const sma50 = i >= 49 ? calcSMA(arr.slice(0, i + 1), 50) : null;
    return {
      date: d.date?.slice(5) || `D${i}`,
      precio: d.close || d.price,
      SMA20: sma20,
      SMA50: sma50,
    };
  });

  return (
    <div className="chart-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="chart-panel glass-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">{stock.symbol} — {stock.name}</h3>
            <p className="chart-subtitle">Precio con medias móviles</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                axisLine={{ stroke: 'var(--border-subtle)' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
                tickFormatter={(v) => `$${v}`}
                width={55}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="precio"
                name="Precio"
                stroke="var(--accent-cyan)"
                strokeWidth={2}
                fill="url(#priceFill)"
              />
              <Line
                type="monotone"
                dataKey="SMA20"
                name="SMA 20"
                stroke="var(--accent-purple)"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="4 2"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="SMA50"
                name="SMA 50"
                stroke="var(--neutral)"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="6 3"
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-legend">
          <span className="legend-item"><span className="legend-line cyan"></span> Precio</span>
          <span className="legend-item"><span className="legend-line purple dashed"></span> SMA 20</span>
          <span className="legend-item"><span className="legend-line yellow dashed"></span> SMA 50</span>
        </div>
      </div>

      <style>{`
        .chart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(6px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeInUp 0.3s ease;
        }

        .chart-panel {
          width: 100%;
          max-width: 460px;
          padding: 16px;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .chart-title {
          font-size: 1rem;
          font-weight: 700;
        }

        .chart-subtitle {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid var(--border-glass);
          background: var(--bg-glass);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: var(--bearish-bg);
          color: var(--bearish);
          border-color: rgba(239, 68, 68, 0.3);
        }

        .chart-container {
          margin: 0 -8px;
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 12px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .legend-line {
          display: inline-block;
          width: 16px;
          height: 2px;
          border-radius: 1px;
        }

        .legend-line.cyan { background: var(--accent-cyan); }
        .legend-line.purple { background: var(--accent-purple); }
        .legend-line.yellow { background: var(--neutral); }
        .legend-line.dashed {
          background: none;
          border-top: 2px dashed;
        }
        .legend-line.purple.dashed { border-color: var(--accent-purple); }
        .legend-line.yellow.dashed { border-color: var(--neutral); }
      `}</style>
    </div>
  );
}
