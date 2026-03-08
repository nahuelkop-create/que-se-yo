import { useState, useEffect, useRef } from 'react';
import { Settings, X, Key, CheckCircle, AlertTriangle } from 'lucide-react';

export default function SettingsPanel({ onClose, onSave }) {
  const [alphaKey, setAlphaKey] = useState('');
  const [gnewsKey, setGnewsKey] = useState('');
  const saveTimerRef = useRef(null);

  // Load saved settings on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cartera-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setAlphaKey(parsed.alphaVantageKey || '');
        setGnewsKey(parsed.gnewsKey || '');
      }
    } catch (e) {
      console.warn('Error cargando configuración:', e);
    }
  }, []);

  /**
   * Auto-saves settings to localStorage (debounced 500ms)
   * and notifies the parent component
   */
  const autoSave = (newAlphaKey, newGnewsKey) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      const settings = {
        alphaVantageKey: newAlphaKey,
        gnewsKey: newGnewsKey,
      };
      localStorage.setItem('cartera-settings', JSON.stringify(settings));
    }, 500);
  };

  const handleAlphaChange = (e) => {
    const val = e.target.value;
    setAlphaKey(val);
    autoSave(val, gnewsKey);
  };

  const handleGnewsChange = (e) => {
    const val = e.target.value;
    setGnewsKey(val);
    autoSave(alphaKey, val);
  };

  const handleSave = () => {
    const settings = {
      alphaVantageKey: alphaKey.trim(),
      gnewsKey: gnewsKey.trim(),
    };
    localStorage.setItem('cartera-settings', JSON.stringify(settings));
    onSave?.(settings);
    onClose?.();
  };

  return (
    <div className="settings-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="settings-panel">
        <div className="settings-header">
          <h3>
            <Settings size={18} /> Configuración
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* CoinGecko status — always connected */}
        <div className="api-status-row">
          <div className="api-status-label">
            <CheckCircle size={14} style={{ color: '#10b981', marginRight: 6 }} />
            CoinGecko (Crypto)
          </div>
          <span className="api-status-badge api-status-connected">Conectado</span>
        </div>
        <p className="api-status-hint">Las criptomonedas cargan automáticamente sin necesidad de clave.</p>

        {/* Alpha Vantage key */}
        <div className="setting-group">
          <label>
            <Key size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
            Alpha Vantage API Key
            {alphaKey.trim() ? (
              <span className="api-status-badge api-status-connected" style={{ marginLeft: 8 }}>
                <CheckCircle size={10} /> Configurada
              </span>
            ) : (
              <span className="api-status-badge api-status-missing" style={{ marginLeft: 8 }}>
                <AlertTriangle size={10} /> Sin clave
              </span>
            )}
          </label>
          <input
            type="text"
            value={alphaKey}
            onChange={handleAlphaChange}
            placeholder="Tu clave de Alpha Vantage..."
          />
          <p className="setting-hint">
            Para acciones, ETFs e índices. Obtené tu clave gratis en{' '}
            <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer">
              alphavantage.co
            </a>
          </p>
        </div>

        {/* GNews key */}
        <div className="setting-group">
          <label>
            <Key size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
            GNews API Key
            {gnewsKey.trim() ? (
              <span className="api-status-badge api-status-connected" style={{ marginLeft: 8 }}>
                <CheckCircle size={10} /> Configurada
              </span>
            ) : (
              <span className="api-status-badge api-status-missing" style={{ marginLeft: 8 }}>
                <AlertTriangle size={10} /> Sin clave
              </span>
            )}
          </label>
          <input
            type="text"
            value={gnewsKey}
            onChange={handleGnewsChange}
            placeholder="Tu clave de GNews..."
          />
          <p className="setting-hint">
            Para noticias financieras. Obtené tu clave gratis en{' '}
            <a href="https://gnews.io" target="_blank" rel="noopener noreferrer">
              gnews.io
            </a>
          </p>
        </div>

        <div className="settings-info">
          💾 Las claves se guardan automáticamente y persisten entre sesiones.
        </div>

        <div className="settings-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Guardar y recargar
          </button>
        </div>

        <style>{`
          .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }

          .settings-header .close-btn {
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
          }

          .api-status-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 12px;
            background: rgba(16, 185, 129, 0.06);
            border: 1px solid rgba(16, 185, 129, 0.15);
            border-radius: 10px;
            margin-bottom: 4px;
            font-size: 0.78rem;
            font-weight: 500;
          }

          .api-status-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 0.62rem;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }

          .api-status-connected {
            background: rgba(16, 185, 129, 0.12);
            color: #10b981;
          }

          .api-status-missing {
            background: rgba(245, 158, 11, 0.12);
            color: #f59e0b;
          }

          .api-status-hint {
            font-size: 0.62rem;
            color: var(--text-muted);
            margin-bottom: 14px;
            padding-left: 4px;
          }

          .settings-info {
            font-size: 0.68rem;
            color: var(--text-muted);
            text-align: center;
            padding: 10px 0;
            border-top: 1px solid var(--border-subtle);
            margin-top: 8px;
          }

          .setting-hint {
            font-size: 0.65rem;
            color: var(--text-muted);
            margin-top: 6px;
          }

          .setting-hint a {
            color: var(--accent-cyan);
            text-decoration: none;
          }

          .setting-hint a:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    </div>
  );
}
