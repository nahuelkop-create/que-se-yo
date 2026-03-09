import { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, Bitcoin, LineChart, Newspaper, Search, Star, Crosshair } from 'lucide-react';
import Header from './components/Header';
import PortfolioSummary from './components/PortfolioSummary';
import CryptoCard from './components/CryptoCard';
import StockCard from './components/StockCard';
import PriceChart from './components/PriceChart';
import NewsCard from './components/NewsCard';
import TechnicalPanel from './components/TechnicalPanel';
import SettingsPanel from './components/SettingsPanel';
import ExploreTab from './components/ExploreTab';
import AssetDetail from './components/AssetDetail';
import NewsTab from './components/NewsTab';
import WatchlistTab from './components/WatchlistTab';
import RadarTab from './components/RadarTab';
import useFavorites from './hooks/useFavorites';
import { fetchCryptoData } from './services/cryptoService';
import { fetchAllStocks } from './services/stockService';
import { fetchNews } from './services/newsService';

const TABS = [
  { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
  { id: 'explorar', label: 'Explorar', icon: Search },
  { id: 'favoritos', label: 'Favoritos', icon: Star },
  { id: 'radar', label: 'Radar', icon: Crosshair },
  { id: 'crypto', label: 'Crypto', icon: Bitcoin },
  { id: 'noticias', label: 'Noticias', icon: Newspaper },
];

function loadSettings() {
  try {
    const saved = localStorage.getItem('cartera-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        alphaVantageKey: parsed.alphaVantageKey || '',
        gnewsKey: parsed.gnewsKey || '',
      };
    }
  } catch (e) {
    console.warn('Error cargando configuración:', e);
  }
  return { alphaVantageKey: '', gnewsKey: '' };
}

function LoadingSkeleton() {
  return (
    <div className="container" style={{ padding: '16px' }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton" style={{ height: 120, marginBottom: 10, borderRadius: 16 }} />
      ))}
    </div>
  );
}

/**
 * DataQualityBanner — muestra un aviso cuando los datos no son reales
 */
function DataQualityBanner({ dataQuality, label }) {
  if (!dataQuality || dataQuality.isReal) return null;

  return (
    <div style={{
      padding: '10px 14px',
      background: 'rgba(245, 158, 11, 0.08)',
      border: '1px solid rgba(245, 158, 11, 0.2)',
      borderRadius: 12,
      fontSize: '0.72rem',
      color: 'var(--text-secondary)',
      lineHeight: 1.5,
      marginBottom: 12,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
    }}>
      <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚠️</span>
      <div>
        <strong style={{ color: '#f59e0b' }}>{label}: Sin datos confiables</strong>
        <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.68rem' }}>
          {dataQuality.reason}
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('resumen');
  const [cryptoData, setCryptoData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [newsQuality, setNewsQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [chartStock, setChartStock] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [settings, setSettings] = useState(loadSettings);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Crypto: siempre intentar CoinGecko (gratis, sin key)
      let crypto;
      try {
        crypto = await fetchCryptoData();
      } catch (e) {
        console.warn('Error cargando crypto:', e.message);
        crypto = [];
      }

      // Acciones: usar Alpha Vantage si hay key
      let stocks;
      try {
        stocks = await fetchAllStocks(settings.alphaVantageKey);
      } catch (e) {
        console.warn('Error cargando stocks:', e.message);
        stocks = [];
      }

      // Noticias: fetchNews ahora retorna { articles, dataQuality }
      let newsResult;
      try {
        newsResult = await fetchNews(settings.gnewsKey);
      } catch (e) {
        console.warn('Error cargando noticias:', e.message);
        newsResult = {
          articles: [],
          dataQuality: { isReal: false, source: 'GNews', lastUpdated: new Date().toISOString(), freshness: 'unknown', reason: `Error: ${e.message}` }
        };
      }

      setCryptoData(crypto);
      setStockData(stocks);
      setNewsData(newsResult.articles);
      setNewsQuality(newsResult.dataQuality);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setCryptoData([]);
      setStockData([]);
      setNewsData([]);
      setNewsQuality({ isReal: false, source: 'mock', lastUpdated: new Date().toISOString(), freshness: 'unknown', reason: 'Error general cargando datos.' });
    } finally {
      setLoading(false);
    }
  }, [settings.alphaVantageKey, settings.gnewsKey]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
  };

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
  };

  const handleBackFromDetail = () => {
    setSelectedAsset(null);
  };

  // If an asset is selected, show its detail view
  if (selectedAsset) {
    return (
      <AssetDetail
        asset={selectedAsset}
        onBack={handleBackFromDetail}
        settings={settings}
        isFavorite={isFavorite(selectedAsset.ticker)}
        onToggleFavorite={toggleFavorite}
      />
    );
  }

  // Check if crypto and stocks have any real data
  const cryptoHasReal = cryptoData?.some(c => c.dataQuality?.isReal);
  const stocksHasReal = stockData?.some(s => s.dataQuality?.isReal);
  // Get crypto dataQuality for banner (from first item that has it)
  const cryptoQuality = cryptoData?.find(c => c.dataQuality)?.dataQuality;
  const stockQuality = stockData?.find(s => s.dataQuality)?.dataQuality;

  const renderContent = () => {
    if (loading) return <LoadingSkeleton />;

    switch (activeTab) {
      case 'resumen':
        return (
          <>
            <PortfolioSummary cryptoData={cryptoData} stockData={stockData} />
            <div className="container">
              {/* Crypto section */}
              <div className="section-header mt-md">
                <h2 className="section-title">
                  <Bitcoin size={16} /> Crypto Destacados
                </h2>
              </div>

              {!cryptoHasReal && (
                <DataQualityBanner dataQuality={cryptoQuality} label="Criptomonedas" />
              )}

              {cryptoData?.filter(c => c.current_price !== null).slice(0, 2).map((coin, i) => (
                <CryptoCard key={coin.id} coin={coin} index={i} />
              ))}

              {cryptoData?.every(c => c.current_price === null) && (
                <div style={{
                  textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.8rem',
                  background: 'var(--bg-glass)', borderRadius: 12, border: '1px solid var(--border-glass)',
                }}>
                  No hay datos de criptomonedas disponibles en este momento.
                </div>
              )}

              {/* Stocks section */}
              <div className="section-header mt-lg">
                <h2 className="section-title">
                  <LineChart size={16} /> Acciones Destacadas
                </h2>
              </div>

              {!stocksHasReal && (
                <DataQualityBanner dataQuality={stockQuality} label="Acciones" />
              )}

              {stockData?.filter(s => s.dataQuality?.isReal).slice(0, 2).map((stock, i) => (
                <StockCard key={stock.symbol} stock={stock} index={i} onShowChart={setChartStock} />
              ))}

              {!stocksHasReal && stockData?.length > 0 && (
                <div style={{
                  textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.8rem',
                  background: 'var(--bg-glass)', borderRadius: 12, border: '1px solid var(--border-glass)',
                }}>
                  Configurá tu API key de Alpha Vantage en ⚙️ para ver acciones.
                </div>
              )}
            </div>

            {/* Info banner about API keys */}
            {!settings.alphaVantageKey && (
              <div className="container mt-md">
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: 12,
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}>
                  💡 <strong>Tip:</strong> Las criptomonedas cargan datos reales automáticamente.
                  Para acciones y ETFs, configurá tu API key de Alpha Vantage en ⚙️ Configuración.
                </div>
              </div>
            )}

            <div className="disclaimer">
              <strong>⚠️ Aviso:</strong> Esta aplicación es solo para fines educativos e informativos.
              No constituye asesoramiento financiero. Las decisiones de inversión deben ser consultadas
              con un profesional certificado. Invierte con responsabilidad.
            </div>
          </>
        );

      case 'explorar':
        return (
          <ExploreTab
            onSelectAsset={handleSelectAsset}
            settings={settings}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        );

      case 'favoritos':
        return (
          <WatchlistTab
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onSelectAsset={handleSelectAsset}
            settings={settings}
          />
        );

      case 'radar':
        return (
          <RadarTab
            onSelectAsset={handleSelectAsset}
            settings={settings}
          />
        );

      case 'crypto':
        return (
          <div className="container mt-md">
            <div className="section-header">
              <h2 className="section-title">
                <Bitcoin size={18} /> Criptomonedas
              </h2>
              <span className="section-subtitle">
                {cryptoData?.filter(c => c.current_price !== null).length || 0} activos con datos
              </span>
            </div>

            {!cryptoHasReal && (
              <DataQualityBanner dataQuality={cryptoQuality} label="Criptomonedas" />
            )}

            {cryptoData?.map((coin, i) => (
              coin.current_price !== null ? (
                <CryptoCard key={coin.id} coin={coin} index={i} />
              ) : (
                <div key={coin.id} style={{
                  padding: '14px 16px', marginBottom: 8, borderRadius: 14,
                  background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{coin.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 8 }}>{coin.symbol}</span>
                  </div>
                  <span style={{
                    fontSize: '0.62rem', color: '#ef4444', background: 'rgba(239,68,68,0.1)',
                    padding: '3px 8px', borderRadius: 20, fontWeight: 600,
                  }}>🔴 Sin datos</span>
                </div>
              )
            ))}
          </div>
        );

      case 'noticias':
        return <NewsTab newsQuality={newsQuality} />;

      default:
        return null;
    }
  };

  return (
    <>
      <Header
        onRefresh={loadData}
        onOpenSettings={() => setShowSettings(true)}
        loading={loading}
      />

      <main className="app-content">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Modals */}
      {chartStock && (
        <PriceChart stock={chartStock} onClose={() => setChartStock(null)} />
      )}

      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsSave}
        />
      )}
    </>
  );
}
