// Servicio de noticias — GNews API
// NO cae a mock silencioso. Marca explícitamente las noticias de ejemplo.

import { mockNews } from '../data/mockData';

const GNEWS_BASE = 'https://gnews.io/api/v4';

/**
 * Fetch financial news.
 * Retorna { articles: [...], dataQuality: {...} }
 */
export async function fetchNews(apiKey) {
  if (!apiKey) {
    return {
      articles: mockNews.map(n => ({ ...n, _isMock: true })),
      dataQuality: {
        isReal: false,
        source: 'mock',
        lastUpdated: new Date().toISOString(),
        freshness: 'unknown',
        reason: 'Noticias de ejemplo. Configurá tu API key de GNews en ⚙️ Configuración para ver noticias reales.',
      },
    };
  }

  try {
    const res = await fetch(
      `${GNEWS_BASE}/search?q=inversiones+finanzas+criptomonedas&lang=es&max=8&apikey=${apiKey}`
    );

    if (!res.ok) throw new Error(`GNews error: ${res.status}`);

    const data = await res.json();
    const articles = (data.articles || []).map(a => ({ ...a, _isMock: false }));

    return {
      articles,
      dataQuality: {
        isReal: true,
        source: 'GNews',
        lastUpdated: new Date().toISOString(),
        freshness: 'fresh',
        reason: 'Noticias reales de GNews.',
      },
    };
  } catch (error) {
    console.warn('GNews no disponible:', error.message);
    return {
      articles: mockNews.map(n => ({ ...n, _isMock: true })),
      dataQuality: {
        isReal: false,
        source: 'GNews',
        lastUpdated: new Date().toISOString(),
        freshness: 'unknown',
        reason: `GNews no disponible: ${error.message}`,
      },
    };
  }
}
