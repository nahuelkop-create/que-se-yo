import { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, Bitcoin, LineChart, Newspaper, Activity } from 'lucide-react';
import Header from './components/Header';
import PortfolioSummary from './components/PortfolioSummary';
import CryptoCard from './components/CryptoCard';
import StockCard from './components/StockCard';
import PriceChart from './components/PriceChart';
import NewsCard from './components/NewsCard';
import TechnicalPanel from './components/TechnicalPanel';
import SettingsPanel from './components/SettingsPanel';
import { fetchCryptoData } from './services/cryptoService';
import { fetchAllStocks } from './services/stockService';
import { fetchNews } from './services/newsService';
import { mockCryptoData, mockStockData, mockNews } from './data/mockData';

const TABS = [
  { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
  { id: 'crypto', label: 'Crypto', icon: Bitcoin },
  { id: 'acciones', label: 'Acciones', icon: LineChart },
  { id: 'noticias', label: 'Noticias', icon: Newspaper },
  { id: 'tecnico', label: 'Técnico', icon: Activity },
];

function LoadingSkeleton() {
  return (
    <div className="container" style={{ padding: '16px' }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton" style={{ height: 120, marginBottom: 10, borderRadius: 16 }} />
      ))}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('resumen');
  const [cryptoData, setCryptoData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [chartStock, setChartStock] = useState(null);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('cartera-settings');
    return saved ? JSON.parse(saved) : { useMock: true, alphaVantageKey: '', gnewsKey: '' };
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (settings.useMock) {
        // Simulate network delay for mockup feel
        await new Promise(r => setTimeout(r, 600));
        setCryptoData(mockCryptoData);
        setStockData(mockStockData);
        setNewsData(mockNews);
      } else {
        const [crypto, stocks, news] = await Promise.all([
          fetchCryptoData(),
          fetchAllStocks(settings.alphaVantageKey),
          fetchNews(settings.gnewsKey),
        ]);
        setCryptoData(crypto);
        setStockData(stocks);
        setNewsData(news);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      setCryptoData(mockCryptoData);
      setStockData(mockStockData);
      setNewsData(mockNews);
    } finally {
      setLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
  };

  const renderContent = () => {
    if (loading) return <LoadingSkeleton />;

    switch (activeTab) {
      case 'resumen':
        return (
          <>
            <PortfolioSummary cryptoData={cryptoData} stockData={stockData} />
            <div className="container">
              <div className="section-header mt-md">
                <h2 className="section-title">
                  <Bitcoin size={16} /> Crypto Destacados
                </h2>
              </div>
              {cryptoData?.slice(0, 2).map((coin, i) => (
                <CryptoCard key={coin.id} coin={coin} index={i} />
              ))}
              <div className="section-header mt-lg">
                <h2 className="section-title">
                  <LineChart size={16} /> Acciones Destacadas
                </h2>
              </div>
              {stockData?.slice(0, 2).map((stock, i) => (
                <StockCard key={stock.symbol} stock={stock} index={i} onShowChart={setChartStock} />
              ))}
            </div>
            <div className="disclaimer">
              <strong>⚠️ Aviso:</strong> Esta aplicación es solo para fines educativos e informativos.
              No constituye asesoramiento financiero. Las decisiones de inversión deben ser consultadas
              con un profesional certificado. Inverte con responsabilidad.
            </div>
          </>
        );

      case 'crypto':
        return (
          <div className="container mt-md">
            <div className="section-header">
              <h2 className="section-title">
                <Bitcoin size={18} /> Criptomonedas
              </h2>
              <span className="section-subtitle">{cryptoData?.length || 0} activos</span>
            </div>
            {cryptoData?.map((coin, i) => (
              <CryptoCard key={coin.id} coin={coin} index={i} />
            ))}
          </div>
        );

      case 'acciones':
        return (
          <div className="container mt-md">
            <div className="section-header">
              <h2 className="section-title">
                <LineChart size={18} /> Mercado de Acciones
              </h2>
              <span className="section-subtitle">{stockData?.length || 0} activos</span>
            </div>
            {stockData?.map((stock, i) => (
              <StockCard key={stock.symbol} stock={stock} index={i} onShowChart={setChartStock} />
            ))}
          </div>
        );

      case 'noticias':
        return (
          <div className="container mt-md">
            <div className="section-header">
              <h2 className="section-title">
                <Newspaper size={18} /> Noticias Financieras
              </h2>
              <span className="section-subtitle">Últimas noticias</span>
            </div>
            {newsData?.map((article, i) => (
              <NewsCard key={i} article={article} index={i} />
            ))}
          </div>
        );

      case 'tecnico':
        return <TechnicalPanel cryptoData={cryptoData} stockData={stockData} />;

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
