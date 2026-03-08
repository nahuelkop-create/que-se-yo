import { TrendingUp, TrendingDown, Minus, ChevronRight, Star } from 'lucide-react';
import SparklineChart from './SparklineChart';

export default function AssetListItem({ asset, priceData, onClick, isFavorite, onToggleFavorite }) {
  const isUp = priceData && priceData.changePercent >= 0;
  const hasPrice = priceData && priceData.price > 0;

  const categoryColors = {
    crypto: 'var(--accent-cyan)',
    acciones: 'var(--accent-indigo)',
    cedears: 'var(--accent-purple)',
    indices: 'var(--neutral)',
    etfs: 'var(--bullish)',
    bonos: '#f472b6',
  };

  const categoryLabels = {
    crypto: 'Crypto',
    acciones: 'Acción',
    cedears: 'CEDEAR',
    indices: 'Índice',
    etfs: 'ETF',
    bonos: 'Bono',
  };

  return (
    <button className="asset-list-item glass-card" onClick={onClick}>
      <div className="ali-left">
        {asset.image ? (
          <img src={asset.image} alt="" className="ali-icon" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
        ) : null}
        <div className="ali-icon-fallback" style={{ display: asset.image ? 'none' : 'flex', background: `${categoryColors[asset.category]}15`, color: categoryColors[asset.category] }}>
          {asset.ticker.slice(0, 2)}
        </div>
        <div className="ali-info">
          <div className="ali-name-row">
            <span className="ali-name">{asset.name}</span>
            {onToggleFavorite && (
              <button
                className={`ali-star ${isFavorite ? 'ali-star-active' : ''}`}
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(asset.ticker); }}
                title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Star size={12} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>
          <div className="ali-meta">
            <span className="ali-ticker">{asset.ticker}</span>
            <span className="ali-cat-dot" style={{ background: categoryColors[asset.category] }} />
            <span className="ali-category">{categoryLabels[asset.category]}</span>
          </div>
        </div>
      </div>

      <div className="ali-right">
        {hasPrice ? (
          <>
            <div className="ali-spark">
              <SparklineChart
                data={priceData.sparkline || []}
                color={isUp ? 'var(--bullish)' : 'var(--bearish)'}
                height={28}
              />
            </div>
            <div className="ali-price-col">
              <span className="ali-price">
                {asset.isBond ? `${priceData.price.toFixed(2)}%` : `$${priceData.price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </span>
              <span className={`ali-change ${isUp ? 'price-up' : 'price-down'}`}>
                {isUp ? '▲' : '▼'} {Math.abs(priceData.changePercent).toFixed(2)}%
              </span>
            </div>
          </>
        ) : (
          <div className="ali-price-col">
            <span className="ali-price" style={{ color: 'var(--text-muted)' }}>—</span>
          </div>
        )}
        <ChevronRight size={14} className="ali-chevron" />
      </div>

      <style>{`
        .asset-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 12px 14px;
          margin-bottom: 6px;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          color: inherit;
        }

        .ali-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          flex: 1;
        }

        .ali-icon {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: 50%;
          background: var(--bg-primary);
        }

        .ali-icon-fallback {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .ali-info {
          min-width: 0;
        }

        .ali-name-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ali-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 120px;
        }

        .ali-star {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--text-muted);
          opacity: 0.35;
          transition: all 0.2s;
          padding: 0;
          flex-shrink: 0;
        }

        .ali-star:hover {
          opacity: 1;
          color: #f59e0b;
        }

        .ali-star-active {
          opacity: 1;
          color: #f59e0b;
        }

        .ali-meta {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 2px;
        }

        .ali-ticker {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .ali-cat-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
        }

        .ali-category {
          font-size: 0.6rem;
          color: var(--text-muted);
        }

        .ali-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ali-spark {
          width: 50px;
        }

        .ali-price-col {
          text-align: right;
          min-width: 70px;
        }

        .ali-price {
          font-size: 0.82rem;
          font-weight: 700;
          display: block;
        }

        .ali-change {
          font-size: 0.68rem;
          font-weight: 600;
        }

        .ali-chevron {
          color: var(--text-muted);
          opacity: 0.4;
          flex-shrink: 0;
        }
      `}</style>
    </button>
  );
}
