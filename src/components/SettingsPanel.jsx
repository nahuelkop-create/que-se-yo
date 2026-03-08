import { useState, useEffect } from 'react';
import { Settings, X, Key, Database } from 'lucide-react';

export default function SettingsPanel({ onClose, onSave }) {
  const [alphaKey, setAlphaKey] = useState('');
  const [gnewsKey, setGnewsKey] = useState('');
  const [useMock, setUseMock] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('cartera-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAlphaKey(parsed.alphaVantageKey || '');
      setGnewsKey(parsed.gnewsKey || '');
      setUseMock(parsed.useMock !== false);
    }
  }, []);

  const handleSave = () => {
    const settings = {
      alphaVantageKey: alphaKey,
      gnewsKey: gnewsKey,
      useMock,
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

        <div className="toggle-row">
          <div>
            <div className="toggle-label">
              <Database size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
              Usar datos de demostración
            </div>
            <div className="toggle-desc">
              Funciona sin claves API con datos simulados
            </div>
          </div>
          <div
            className={`toggle ${useMock ? 'active' : ''}`}
            onClick={() => setUseMock(!useMock)}
            role="switch"
            aria-checked={useMock}
          />
        </div>

        {!useMock && (
          <>
            <div className="setting-group">
              <label>
                <Key size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
                Alpha Vantage API Key
              </label>
              <input
                type="text"
                value={alphaKey}
                onChange={(e) => setAlphaKey(e.target.value)}
                placeholder="Tu clave de Alpha Vantage..."
              />
              <p className="setting-hint">
                Obtén tu clave gratis en{' '}
                <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer">
                  alphavantage.co
                </a>
              </p>
            </div>

            <div className="setting-group">
              <label>
                <Key size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
                GNews API Key
              </label>
              <input
                type="text"
                value={gnewsKey}
                onChange={(e) => setGnewsKey(e.target.value)}
                placeholder="Tu clave de GNews..."
              />
              <p className="setting-hint">
                Obtén tu clave gratis en{' '}
                <a href="https://gnews.io" target="_blank" rel="noopener noreferrer">
                  gnews.io
                </a>
              </p>
            </div>
          </>
        )}

        <div className="settings-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Guardar
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
