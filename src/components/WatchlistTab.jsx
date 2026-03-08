import { useState, useEffect, useMemo } from 'react';
import { Star, TrendingUp, TrendingDown, Minus, ChevronRight, ArrowUpDown, Inbox } from 'lucide-react';
import { fetchAssetPrice } from '../services/assetService';
import assetCatalog from '../data/assetCatalog';
import SparklineChart from './SparklineChart';

const SORT_MODES = [
  { id: 'name', label: 'Nombre' },
  { id: 'change', label: 'Variación' },
  { id: 'category', label: 'Categoría' },
];

const categoryLabels = {
  crypto: 'Crypto', acciones: 'Acción', cedears: 'CEDEAR',
  indices: 'Índice', etfs: 'ETF', bonos: 'Bono',
};

const categoryColors = {
  crypto: 'var(--accent-cyan)', acciones: 'var(--accent-indigo)',
  cedears: 'var(--accent-purple)', indices: 'var(--neutral)',
  etfs: 'var(--bullish)', bonos: '#f472b6',
};

export default function WatchlistTab({ favorites, toggleFavorite, onSelectAsset, settings }) {
  const [prices, setPrices] = useState({});
  const [sortMode, setSortMode] = useState('name');
  const [loadingPrices, setLoadingPrices] = useState(false);

  // Get asset objects for favorites
  const favoriteAssets = useMemo(() => {
    return favorites
      .map(ticker => assetCatalog.find(a => a.ticker.toUpperCase() === ticker))
      .filter(Boolean);
  }, [favorites]);

  // Fetch prices for favorite assets
  useEffect(() => {
    if (favoriteAssets.length === 0) return;
    setLoadingPrices(true);
    const fetchPrices = async () => {
      const newPrices = {};
      await Promise.all(
        favoriteAssets.map(async (asset) => {
          try {
            const data = await fetchAssetPrice(asset, settings);
            newPrices[asset.ticker] = data;
          } catch {
            newPrices[asset.ticker] = null;
          }
        })
      );
      setPrices(newPrices);
      setLoadingPrices(false);
    };
    fetchPrices();
  }, [favoriteAssets, settings]);

  // Sort assets
  const sortedAssets = useMemo(() => {
    const list = [...favoriteAssets];
    switch (sortMode) {
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'change':
        return list.sort((a, b) => {
          const ca = prices[a.ticker]?.changePercent || 0;
          const cb = prices[b.ticker]?.changePercent || 0;
          return cb - ca;
        });
      case 'category':
        return list.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return list;
    }
  }, [favoriteAssets, sortMode, prices]);

  // Empty state
  if (favorites.length === 0) {
    return (
      <div className="watchlist-tab container mt-md">
        <div className="section-header">
          <h2 className="section-title">
            <Star size={18} /> Favoritos
          </h2>
        </div>
        <div className="wl-empty glass-card">
          <div className="wl-empty-icon">
            <Star size={40} />
          </div>
          <h3 className="wl-empty-title">Tu watchlist está vacía</h3>
          <p className="wl-empty-desc">
            Marcá activos como favoritos desde la pestaña Explorar usando el ícono ★ para hacer un seguimiento rápido.
          </p>
        </div>

        <style>{watchlistStyles}</style>
      </div>
    );
  }

  return (
    <div className="watchlist-tab container mt-md">
      <div className="section-header">
        <h2 className="section-title">
          <Star size={18} /> Favoritos
        </h2>
        <span className="section-subtitle">{favorites.length} activos</span>
      </div>

      {/* Sort Controls */}
      <div className="wl-sort-bar">
        <ArrowUpDown size={12} className="wl-sort-icon" />
        {SORT_MODES.map(mode => (
          <button
            key={mode.id}
            className={`wl-sort-btn ${sortMode === mode.id ? 'active' : ''}`}
            onClick={() => setSortMode(mode.id)}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Asset List */}
      <div className="wl-list">
        {sortedAssets.map((asset, i) => {
          const priceData = prices[asset.ticker];
          const hasPrice = priceData && priceData.price > 0;
          const isUp = priceData?.changePercent >= 0;

          return (
            <div
              key={asset.ticker}
              className="wl-item glass-card fade-in-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <button
                className="wl-item-main"
                onClick={() => onSelectAsset(asset)}
              >
                <div className="wl-item-left">
                  {asset.image ? (
                    <img
                      src={asset.image}
                      alt=""
                      className="wl-item-icon"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <div
                    className="wl-item-icon-fallback"
                    style={{
                      display: asset.image ? 'none' : 'flex',
                      background: `${categoryColors[asset.category]}15`,
                      color: categoryColors[asset.category],
                    }}
                  >
                    {asset.ticker.slice(0, 2)}
                  </div>
                  <div className="wl-item-info">
                    <span className="wl-item-name">{asset.name}</span>
                    <div className="wl-item-meta">
                      <span className="wl-item-ticker">{asset.ticker}</span>
                      <span className="wl-item-cat-dot" style={{ background: categoryColors[asset.category] }} />
                      <span className="wl-item-cat">{categoryLabels[asset.category]}</span>
                    </div>
                  </div>
                </div>

                <div className="wl-item-right">
                  {loadingPrices && !hasPrice ? (
                    <div className="wl-item-loading">
                      <div className="skeleton" style={{ width: 60, height: 12, borderRadius: 6 }} />
                    </div>
                  ) : hasPrice ? (
                    <>
                      <div className="wl-item-spark">
                        <SparklineChart
                          data={priceData.sparkline || []}
                          color={isUp ? 'var(--bullish)' : 'var(--bearish)'}
                          height={28}
                        />
                      </div>
                      <div className="wl-item-price-col">
                        <span className="wl-item-price">
                          {asset.isBond
                            ? `${priceData.price.toFixed(2)}%`
                            : `$${priceData.price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          }
                        </span>
                        <span className={`wl-item-change ${isUp ? 'price-up' : 'price-down'}`}>
                          {isUp ? '▲' : '▼'} {Math.abs(priceData.changePercent).toFixed(2)}%
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="wl-item-price" style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                  <ChevronRight size={14} className="wl-item-chevron" />
                </div>
              </button>

              <button
                className="wl-star-btn wl-star-active"
                onClick={(e) => { e.stopPropagation(); toggleFavorite(asset.ticker); }}
                title="Quitar de favoritos"
              >
                <Star size={14} fill="currentColor" />
              </button>
            </div>
          );
        })}
      </div>

      <style>{watchlistStyles}</style>
    </div>
  );
}

const watchlistStyles = `
  .wl-empty {
    padding: 40px 24px;
    text-align: center;
    margin-top: 16px;
  }

  .wl-empty-icon {
    color: var(--text-muted);
    opacity: 0.2;
    margin-bottom: 12px;
  }

  .wl-empty-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .wl-empty-desc {
    font-size: 0.78rem;
    color: var(--text-muted);
    line-height: 1.5;
    max-width: 280px;
    margin: 0 auto;
  }

  .wl-sort-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
  }

  .wl-sort-icon {
    color: var(--text-muted);
    flex-shrink: 0;
    margin-right: 4px;
  }

  .wl-sort-btn {
    padding: 5px 12px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-glass);
    background: var(--bg-glass);
    color: var(--text-muted);
    font-family: 'Inter', sans-serif;
    font-size: 0.65rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .wl-sort-btn:hover {
    border-color: var(--accent-cyan);
    color: var(--text-secondary);
  }

  .wl-sort-btn.active {
    background: linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan));
    border-color: transparent;
    color: white;
    font-weight: 600;
  }

  .wl-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .wl-item {
    display: flex;
    align-items: center;
    padding: 0;
    overflow: hidden;
  }

  .wl-item:hover {
    border-color: var(--border-glass);
  }

  .wl-item-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    padding: 12px 8px 12px 14px;
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    color: inherit;
    text-align: left;
    min-width: 0;
  }

  .wl-item-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }

  .wl-item-icon {
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 50%;
    background: var(--bg-primary);
  }

  .wl-item-icon-fallback {
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 800;
  }

  .wl-item-info {
    min-width: 0;
  }

  .wl-item-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    max-width: 130px;
  }

  .wl-item-meta {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 2px;
  }

  .wl-item-ticker {
    font-size: 0.62rem;
    color: var(--text-muted);
    font-weight: 600;
  }

  .wl-item-cat-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
  }

  .wl-item-cat {
    font-size: 0.58rem;
    color: var(--text-muted);
  }

  .wl-item-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .wl-item-spark {
    width: 50px;
  }

  .wl-item-price-col {
    text-align: right;
    min-width: 68px;
  }

  .wl-item-price {
    font-size: 0.8rem;
    font-weight: 700;
    display: block;
  }

  .wl-item-change {
    font-size: 0.66rem;
    font-weight: 600;
  }

  .wl-item-chevron {
    color: var(--text-muted);
    opacity: 0.4;
    flex-shrink: 0;
  }

  .wl-item-loading {
    min-width: 60px;
  }

  .wl-star-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 100%;
    min-height: 56px;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--text-muted);
    transition: all 0.2s;
    flex-shrink: 0;
    border-left: 1px solid var(--border-subtle);
  }

  .wl-star-btn:hover {
    color: var(--accent-cyan);
  }

  .wl-star-active {
    color: #f59e0b;
  }

  .wl-star-active:hover {
    color: #d97706;
  }
`;
