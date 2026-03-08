export default function PeriodSelector({ activePeriod, onChange }) {
  const periods = [
    { id: '1D', label: '1D' },
    { id: '1W', label: '1S' },
    { id: '1M', label: '1M' },
    { id: '1Y', label: '1A' },
    { id: 'MAX', label: 'MAX' },
  ];

  return (
    <div className="period-selector">
      {periods.map(p => (
        <button
          key={p.id}
          className={`period-pill ${activePeriod === p.id ? 'active' : ''}`}
          onClick={() => onChange(p.id)}
        >
          {p.label}
        </button>
      ))}

      <style>{`
        .period-selector {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .period-pill {
          flex: 1;
          padding: 7px 0;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--text-muted);
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }

        .period-pill:hover {
          color: var(--text-secondary);
        }

        .period-pill.active {
          background: linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan));
          color: white;
          box-shadow: 0 2px 8px var(--accent-cyan-glow);
        }
      `}</style>
    </div>
  );
}
