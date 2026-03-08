import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'cartera_favorites';

/**
 * Hook for managing favorite assets with localStorage persistence
 * @returns {{ favorites: string[], toggleFavorite: (ticker: string) => void, isFavorite: (ticker: string) => boolean }}
 */
export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('No se pudo guardar favoritos:', e);
    }
  }, [favorites]);

  const toggleFavorite = useCallback((ticker) => {
    setFavorites(prev => {
      const upper = ticker.toUpperCase();
      if (prev.includes(upper)) {
        return prev.filter(t => t !== upper);
      }
      return [...prev, upper];
    });
  }, []);

  const isFavorite = useCallback((ticker) => {
    return favorites.includes(ticker.toUpperCase());
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
