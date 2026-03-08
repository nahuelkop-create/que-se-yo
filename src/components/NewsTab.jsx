import { useState, useMemo } from 'react';
import {
  Newspaper, Search, TrendingUp, TrendingDown, Minus,
  ExternalLink, Clock, Star, Zap
} from 'lucide-react';
import { getNewsByCategory, searchNews, getFeaturedNews } from '../data/mockNews';

const CATEGORIES = [
  { id: 'todo', label: 'Todo' },
  { id: 'crypto', label: 'Cripto' },
  { id: 'acciones', label: 'Acciones' },
  { id: 'indices', label: 'Índices' },
  { id: 'bonos', label: 'Bonos' },
  { id: 'etfs', label: 'ETFs' },
  { id: 'cedears', label: 'CEDEARs' },
  { id: 'macro', label: 'Macro' },
];

const impactConfig = {
  alcista: { icon: <TrendingUp size={10} />, label: 'Alcista', className: 'nt-impact-up' },
  bajista: { icon: <TrendingDown size={10} />, label: 'Bajista', className: 'nt-impact-down' },
  neutral: { icon: <Minus size={10} />, label: 'Neutral', className: 'nt-impact-neutral' },
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 3600) return `hace ${Math.max(1, Math.floor(diff / 60))} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
}

export default function NewsTab() {
  const [category, setCategory] = useState('todo');
  const [searchQuery, setSearchQuery] = useState('');

  const featured = useMemo(() => getFeaturedNews(), []);

  const news = useMemo(() => {
    if (searchQuery.length >= 2) return searchNews(searchQuery, 25);
    return getNewsByCategory(category, 25);
  }, [category, searchQuery]);

  return (
    <div className="news-tab container mt-md">
      {/* Header */}
      <div className="section-header">
        <h2 className="section-title">
          <Newspaper size={18} /> Noticias Financieras
        </h2>
        <span className="section-subtitle">{news.length} artículos</span>
      </div>

      {/* Search */}
      <div className="nt-search-bar">
        <Search size={14} className="nt-search-icon" />
        <input
          type="text"
          placeholder="Buscar noticias..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="nt-search-input"
        />
      </div>

      {/* Category Filters */}
      <div className="nt-categories">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`nt-cat-pill ${category === cat.id ? 'active' : ''}`}
            onClick={() => { setCategory(cat.id); setSearchQuery(''); }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Featured Section */}
      {category === 'todo' && !searchQuery && featured.length > 0 && (
        <div className="nt-featured">
          <h3 className="nt-featured-title">
            <Star size={13} /> Destacadas
          </h3>
          <div className="nt-featured-scroll">
            {featured.map((article, i) => {
              const impact = impactConfig[article.impact] || impactConfig.neutral;
              return (
                <a
                  key={i}
                  href={article.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nt-featured-card glass-card"
                >
                  <div className="nt-featured-top">
                    <span className={`nt-impact ${impact.className}`}>
                      {impact.icon} {impact.label}
                    </span>
                    <span className="nt-featured-cat">{article.category}</span>
                  </div>
                  <h4 className="nt-featured-card-title">{article.title}</h4>
                  <div className="nt-featured-meta">
                    <span className="nt-featured-source">{article.source?.name}</span>
                    <span className="nt-featured-time">
                      <Clock size={9} /> {timeAgo(article.publishedAt)}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* News List */}
      <div className="nt-list">
        {news.length === 0 ? (
          <div className="nt-empty glass-card">
            <Newspaper size={24} style={{ opacity: 0.3, marginBottom: 8 }} />
            <p>No se encontraron noticias{searchQuery ? ` para "${searchQuery}"` : ''}.</p>
          </div>
        ) : (
          news.map((article, i) => {
            const impact = impactConfig[article.impact] || impactConfig.neutral;
            return (
              <a
                key={i}
                href={article.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="nt-news-item glass-card fade-in-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="nt-news-top">
                  <span className={`nt-impact ${impact.className}`}>
                    {impact.icon} {impact.label}
                  </span>
                  {article.tickers?.length > 0 && (
                    <div className="nt-tickers">
                      {article.tickers.slice(0, 3).map(t => (
                        <span key={t} className="nt-ticker">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <h4 className="nt-news-title">{article.title}</h4>
                <p className="nt-news-desc">{article.description}</p>
                <div className="nt-news-meta">
                  <span className="nt-news-source">{article.source?.name}</span>
                  <span className="nt-news-time">
                    <Clock size={9} /> {timeAgo(article.publishedAt)}
                  </span>
                  <ExternalLink size={9} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                </div>
              </a>
            );
          })
        )}
      </div>

      <style>{`
        .news-tab {
          padding-bottom: 20px;
        }

        .nt-search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: var(--radius-lg);
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
          margin-bottom: 12px;
        }

        .nt-search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .nt-search-input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
        }

        .nt-search-input::placeholder {
          color: var(--text-muted);
        }

        .nt-categories {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 8px;
          margin-bottom: 14px;
          scrollbar-width: none;
        }

        .nt-categories::-webkit-scrollbar {
          display: none;
        }

        .nt-cat-pill {
          padding: 6px 14px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-glass);
          background: var(--bg-glass);
          color: var(--text-muted);
          font-family: 'Inter', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .nt-cat-pill:hover {
          border-color: var(--accent-cyan);
          color: var(--text-secondary);
        }

        .nt-cat-pill.active {
          background: linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan));
          border-color: transparent;
          color: white;
          font-weight: 600;
        }

        /* Featured */
        .nt-featured {
          margin-bottom: 16px;
        }

        .nt-featured-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
        }

        .nt-featured-scroll {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 6px;
          scrollbar-width: none;
        }

        .nt-featured-scroll::-webkit-scrollbar {
          display: none;
        }

        .nt-featured-card {
          min-width: 260px;
          max-width: 280px;
          padding: 14px;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          flex-shrink: 0;
          border: 1px solid var(--border-glass);
          transition: all 0.2s;
        }

        .nt-featured-card:hover {
          border-color: var(--accent-cyan);
        }

        .nt-featured-card:hover .nt-featured-card-title {
          color: var(--accent-cyan);
        }

        .nt-featured-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .nt-featured-cat {
          font-size: 0.55rem;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .nt-featured-card-title {
          font-size: 0.78rem;
          font-weight: 600;
          line-height: 1.35;
          color: var(--text-primary);
          transition: color 0.2s;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .nt-featured-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.58rem;
          color: var(--text-muted);
        }

        .nt-featured-source {
          font-weight: 600;
          color: var(--accent-purple);
        }

        .nt-featured-time {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        /* Impact badges */
        .nt-impact {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.55rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .nt-impact-up {
          background: var(--bullish-bg);
          color: var(--bullish);
        }

        .nt-impact-down {
          background: var(--bearish-bg);
          color: var(--bearish);
        }

        .nt-impact-neutral {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        /* News List */
        .nt-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nt-news-item {
          display: block;
          padding: 12px;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nt-news-item:hover {
          border-color: var(--accent-cyan);
        }

        .nt-news-item:hover .nt-news-title {
          color: var(--accent-cyan);
        }

        .nt-news-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .nt-tickers {
          display: flex;
          gap: 4px;
          margin-left: auto;
        }

        .nt-ticker {
          padding: 1px 6px;
          border-radius: 4px;
          background: rgba(99, 102, 241, 0.1);
          color: var(--accent-indigo);
          font-size: 0.55rem;
          font-weight: 700;
          font-family: 'Inter', monospace;
        }

        .nt-news-title {
          font-size: 0.8rem;
          font-weight: 600;
          line-height: 1.35;
          color: var(--text-primary);
          transition: color 0.2s;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .nt-news-desc {
          font-size: 0.7rem;
          color: var(--text-muted);
          line-height: 1.45;
          margin-top: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .nt-news-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
          font-size: 0.58rem;
          color: var(--text-muted);
        }

        .nt-news-source {
          font-weight: 600;
          color: var(--accent-purple);
        }

        .nt-news-time {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .nt-empty {
          padding: 30px 20px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.78rem;
        }
      `}</style>
    </div>
  );
}
