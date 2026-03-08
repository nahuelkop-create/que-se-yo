import { ExternalLink, Clock } from 'lucide-react';

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
}

export default function NewsCard({ article, index }) {
  return (
    <a
      href={article.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="news-card glass-card fade-in-up"
      style={{ animationDelay: `${index * 0.08}s`, textDecoration: 'none' }}
    >
      {article.image && (
        <div className="news-thumb">
          <img
            src={article.image}
            alt=""
            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
          />
        </div>
      )}
      <div className="news-content">
        <h4 className="news-title">{article.title}</h4>
        {article.description && (
          <p className="news-desc">{article.description.slice(0, 100)}...</p>
        )}
        <div className="news-meta">
          <span className="news-source">{article.source?.name || 'Fuente'}</span>
          <span className="news-time">
            <Clock size={10} /> {timeAgo(article.publishedAt)}
          </span>
          <ExternalLink size={10} className="news-link-icon" />
        </div>
      </div>

      <style>{`
        .news-card {
          display: flex;
          gap: 12px;
          padding: 12px;
          margin-bottom: 10px;
          cursor: pointer;
          color: inherit;
        }

        .news-card:hover .news-title {
          color: var(--accent-cyan);
        }

        .news-thumb {
          width: 70px;
          min-width: 70px;
          height: 70px;
          border-radius: 10px;
          overflow: hidden;
          background: var(--bg-secondary);
        }

        .news-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .news-content {
          flex: 1;
          min-width: 0;
        }

        .news-title {
          font-size: 0.82rem;
          font-weight: 600;
          line-height: 1.35;
          color: var(--text-primary);
          transition: color 0.2s;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .news-desc {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 4px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .news-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 6px;
          font-size: 0.62rem;
          color: var(--text-muted);
        }

        .news-source {
          font-weight: 600;
          color: var(--accent-purple);
        }

        .news-time {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .news-link-icon {
          margin-left: auto;
          opacity: 0.5;
        }
      `}</style>
    </a>
  );
}
