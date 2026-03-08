import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, X, Compass } from 'lucide-react';
import assetCatalog, { ASSET_CATEGORIES, searchAssets } from '../data/assetCatalog';
import { fetchAssetPrice } from '../services/assetService';
import AssetListItem from './AssetListItem';

export default function ExploreTab({ onSelectAsset, settings, isFavorite, onToggleFavorite }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [priceCache, setPriceCache] = useState({});
  const [loadingPrices, setLoadingPrices] = useState(true);

  // Filter assets
  const filteredAssets = useMemo(
    () => searchAssets(query, activeCategory),
    [query, activeCategory]
  );

  // Load prices for visible assets
  const loadPrices = useCallback(async () => {
    setLoadingPrices(true);
    const toLoad = filteredAssets.filter(a => !priceCache[a.id]);
    
    if (toLoad.length === 0) {
      setLoadingPrices(false);
      return;
    }

    // Load in batches to avoid overwhelming
    const batchSize = 10;
    const newCache = { ...priceCache };

    for (let i = 0; i < toLoad.length; i += batchSize) {
      const batch = toLoad.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (asset) => {
          try {
            const data = await fetchAssetPrice(asset, settings);
            return { id: asset.id, data };
          } catch {
            return { id: asset.id, data: null };
          }
        })
      );

      results.forEach(({ id, data }) => {
        if (data) newCache[id] = data;
      });
    }

    setPriceCache(newCache);
    setLoadingPrices(false);
  }, [filteredAssets, settings]);

  useEffect(() => {
    loadPrices();
  }, [activeCategory]);

  // Load prices on mount for initial view
  useEffect(() => {
    loadPrices();
  }, []);

  return (
    <div className="explore-tab fade-in-up">
      {/* Search Bar */}
      <div className="explore-search-container container">
        <div className="explore-search-bar glass-card">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="explore-search-input"
            placeholder="Buscar activos, tickers, sectores..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="explore-categories">
        <div className="categories-scroll">
          {ASSET_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="explore-results container">
        <div className="results-header">
          <span className="results-count">
            {filteredAssets.length} activo{filteredAssets.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="explore-empty">
            <Compass size={32} />
            <p>No se encontraron activos</p>
            <p className="explore-empty-hint">Intentá con otro término o categoría</p>
          </div>
        ) : (
          <div className="asset-list">
            {filteredAssets.map((asset, i) => (
              <div key={asset.id} style={{ animationDelay: `${Math.min(i * 0.03, 0.5)}s` }} className="fade-in-up">
                <AssetListItem
                  asset={asset}
                  priceData={priceCache[asset.id]}
                  onClick={() => onSelectAsset(asset)}
                  isFavorite={isFavorite?.(asset.ticker)}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            ))}
          </div>
        )}

        {loadingPrices && filteredAssets.length > 0 && Object.keys(priceCache).length === 0 && (
          <div className="explore-loading">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="skeleton" style={{ height: 60, marginBottom: 6, borderRadius: 12 }} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .explore-tab {
          padding-top: 12px;
        }

        .explore-search-container {
          margin-bottom: 12px;
        }

        .explore-search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
        }

        .explore-search-bar:hover {
          transform: none;
        }

        .search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .explore-search-input {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          outline: none;
        }

        .explore-search-input::placeholder {
          color: var(--text-muted);
        }

        .search-clear {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          background: var(--bg-primary);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
        }

        .explore-categories {
          margin-bottom: 12px;
          overflow: hidden;
        }

        .categories-scroll {
          display: flex;
          gap: 6px;
          padding: 0 16px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .categories-scroll::-webkit-scrollbar {
          display: none;
        }

        .cat-pill {
          padding: 6px 14px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-glass);
          background: var(--bg-glass);
          color: var(--text-secondary);
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cat-pill:hover {
          background: var(--bg-card-hover);
        }

        .cat-pill.active {
          background: linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan));
          color: white;
          border-color: transparent;
          box-shadow: 0 2px 10px var(--accent-cyan-glow);
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .results-count {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .explore-empty {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-muted);
        }

        .explore-empty svg {
          margin-bottom: 12px;
          opacity: 0.4;
        }

        .explore-empty p {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .explore-empty-hint {
          font-size: 0.72rem;
          margin-top: 4px;
          opacity: 0.6;
        }

        .asset-list {
          display: flex;
          flex-direction: column;
        }

        .explore-loading {
          padding-top: 8px;
        }
      `}</style>
    </div>
  );
}
