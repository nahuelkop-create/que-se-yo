import { Newspaper, ExternalLink, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getNewsByAsset } from '../data/mockNews';

/**
 * Asset-specific news panel for the asset detail view
 */
export default function AssetNews({ asset }) {
  const news = getNewsByAsset(asset.ticker, asset.category, 5);

  if (!news || news.length === 0) {
    return (
      <div className="asset-news container mt-md">
        <h3 className="section-title" style={{ marginBottom: 10 }}>
          <Newspaper size={16} /> Noticias de {asset.name}
        </h3>
        <div className="glass-card an-empty">
          <Newspaper size={24} style={{ opacity: 0.3, marginBottom: 8 }} />
          <p>No hay noticias disponibles para {asset.name} en este momento.</p>
        </div>
      </div>
    );
  }

  const impactConfig = {
    alcista: { icon: <TrendingUp size={10} />, label: 'Alcista', className: 'an-impact-up' },
    bajista: { icon: <TrendingDown size={10} />, label: 'Bajista', className: 'an-impact-down' },
    neutral: { icon: <Minus size={10} />, label: 'Neutral', className: 'an-impact-neutral' },
  };

  return (
    <div className="asset-news container mt-md fade-in-up">
      <h3 className="section-title" style={{ marginBottom: 10 }}>
        <Newspaper size={16} /> Noticias de {asset.name}
      </h3>

      <div className="an-list">
        {news.map((article, i) => {
          const impact = impactConfig[article.impact] || impactConfig.neutral;
          return (
            <a
              key={i}
              href={article.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="an-item glass-card"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="an-item-content">
                <div className="an-item-header">
                  <span className={`an-impact ${impact.className}`}>
                    {impact.icon} {impact.label}
                  </span>
                </div>
                <h4 className="an-item-title">{article.title}</h4>
                <p className="an-item-desc">{article.description}</p>
                <div className="an-item-meta">
                  <span className="an-item-source">{article.source?.name}</span>
                  <span className="an-item-time">
                    <Clock size={9} /> {timeAgo(article.publishedAt)}
                  </span>
                  <ExternalLink size={9} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <style>{`
        .an-empty {
          padding: 30px 20px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.78rem;
        }

        .an-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .an-item {
          display: block;
          padding: 12px;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          transition: all 0.2s;
        }

        .an-item:hover {
          border-color: var(--accent-cyan);
        }

        .an-item:hover .an-item-title {
          color: var(--accent-cyan);
        }

        .an-item-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .an-impact {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.58rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .an-impact-up {
          background: var(--bullish-bg);
          color: var(--bullish);
        }

        .an-impact-down {
          background: var(--bearish-bg);
          color: var(--bearish);
        }

        .an-impact-neutral {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .an-item-title {
          font-size: 0.78rem;
          font-weight: 600;
          line-height: 1.35;
          color: var(--text-primary);
          transition: color 0.2s;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .an-item-desc {
          font-size: 0.68rem;
          color: var(--text-muted);
          line-height: 1.45;
          margin-top: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .an-item-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 6px;
          font-size: 0.58rem;
          color: var(--text-muted);
        }

        .an-item-source {
          font-weight: 600;
          color: var(--accent-purple);
        }

        .an-item-time {
          display: flex;
          align-items: center;
          gap: 3px;
        }
      `}</style>
    </div>
  );
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 3600) return `hace ${Math.max(1, Math.floor(diff / 60))} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
}
