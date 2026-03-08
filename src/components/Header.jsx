import { BarChart3, Settings, RefreshCw } from 'lucide-react';

export default function Header({ onRefresh, onOpenSettings, loading }) {
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="header-brand">
          <div className="header-logo">
            <BarChart3 size={22} />
          </div>
          <div>
            <h1 className="header-title">Cartera Inteligente</h1>
            <p className="header-subtitle">Análisis de inversiones en tiempo real</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="header-btn"
            onClick={onRefresh}
            disabled={loading}
            title="Actualizar datos"
          >
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
          </button>
          <button
            className="header-btn"
            onClick={onOpenSettings}
            title="Configuración"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .app-header {
          padding: 16px 16px 12px;
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(10, 14, 23, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-logo {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px var(--accent-cyan-glow);
        }

        .header-title {
          font-size: 1.1rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--text-primary), var(--accent-cyan));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .header-subtitle {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 400;
        }

        .header-actions {
          display: flex;
          gap: 6px;
        }

        .header-btn {
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
        }

        .header-btn:hover {
          background: var(--bg-card-hover);
          color: var(--accent-cyan);
          border-color: rgba(6, 182, 212, 0.3);
        }

        .header-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </header>
  );
}
