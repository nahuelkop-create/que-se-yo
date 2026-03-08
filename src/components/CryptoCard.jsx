import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { analyzeAsset, formatCurrency, generateOutlook } from '../utils/analysis';
import SparklineChart from './SparklineChart';

export default function CryptoCard({ coin, index }) {
  const analysis = analyzeAsset(coin.priceHistory, coin.current_price);
  const change = coin.price_change_percentage_24h || analysis.changePercent;
  const isUp = change >= 0;

  const trendIcon = {
    alcista: <TrendingUp size={12} />,
    bajista: <TrendingDown size={12} />,
    neutral: <Minus size={12} />,
  };

  const trendLabel = {
    alcista: 'Alcista',
    bajista: 'Bajista',
    neutral: 'Neutral',
  };

  return (
    <div className="crypto-card glass-card fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="crypto-card-top">
        <div className="crypto-info">
          <img
            src={coin.image}
            alt={coin.name}
            className="crypto-icon"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div>
            <h3 className="crypto-name">{coin.name}</h3>
            <span className="crypto-symbol">{coin.symbol}</span>
          </div>
        </div>
        <div className="crypto-price-block">
          <span className="crypto-price">{formatCurrency(coin.current_price)}</span>
          <span className={`crypto-change ${isUp ? 'price-up' : 'price-down'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="crypto-sparkline">
        <SparklineChart
          data={coin.sparkline_in_7d?.price || coin.priceHistory?.map(d => d.price) || []}
          color={isUp ? 'var(--bullish)' : 'var(--bearish)'}
          height={60}
        />
      </div>

      <div className="crypto-card-bottom">
        <div className="crypto-stats">
          <div className="crypto-stat">
            <span className="stat-label">Cap. Mercado</span>
            <span className="stat-value">{formatCurrency(coin.market_cap)}</span>
          </div>
          <div className="crypto-stat">
            <span className="stat-label">RSI</span>
            <span className="stat-value">{analysis.rsi ?? '—'}</span>
          </div>
          <div className="crypto-stat">
            <span className="stat-label">Señal</span>
            <span className={`badge badge-${analysis.recommendation.color}`}>
              {analysis.recommendation.signal}
            </span>
          </div>
        </div>
        <div className={`trend-indicator badge badge-${analysis.trend === 'alcista' ? 'bullish' : analysis.trend === 'bajista' ? 'bearish' : 'neutral'}`}>
          {trendIcon[analysis.trend]} {trendLabel[analysis.trend]}
        </div>
      </div>

      <style>{`
        .crypto-card {
          padding: 14px;
          margin-bottom: 10px;
        }

        .crypto-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .crypto-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .crypto-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-primary);
        }

        .crypto-name {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .crypto-symbol {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .crypto-price-block {
          text-align: right;
        }

        .crypto-price {
          font-size: 1rem;
          font-weight: 700;
          display: block;
        }

        .crypto-change {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .crypto-sparkline {
          margin: 10px -4px;
        }

        .crypto-card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 4px;
        }

        .crypto-stats {
          display: flex;
          gap: 14px;
        }

        .crypto-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-label {
          font-size: 0.6rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .stat-value {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .trend-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>
    </div>
  );
}
