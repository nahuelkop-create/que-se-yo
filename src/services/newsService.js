import { mockNews } from '../data/mockData';

const GNEWS_BASE = 'https://gnews.io/api/v4';

/**
 * Fetch financial news in Spanish
 */
export async function fetchNews(apiKey) {
  if (!apiKey) {
    console.info('Sin clave GNews, usando noticias de respaldo');
    return mockNews;
  }
  
  try {
    const res = await fetch(
      `${GNEWS_BASE}/search?q=inversiones+finanzas+criptomonedas&lang=es&max=8&apikey=${apiKey}`
    );
    
    if (!res.ok) throw new Error(`GNews error: ${res.status}`);
    
    const data = await res.json();
    return data.articles || mockNews;
  } catch (error) {
    console.warn('GNews no disponible, usando noticias de respaldo:', error.message);
    return mockNews;
  }
}
