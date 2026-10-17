import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favoriteKeys, setFavoriteKeys] = useState(new Set());
  const [favoritesList, setFavoritesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavoriteIds = useCallback(async () => {
    if (!user) {
      setFavoriteKeys(new Set());
      setFavoritesList([]);
      return;
    }
    try {
      setLoading(true);
      const res = await API.get('/favorites/ids');
      if (Array.isArray(res.data)) {
        setFavoriteKeys(new Set(res.data));
      }
      const listRes = await API.get('/favorites');
      if (Array.isArray(listRes.data)) {
        setFavoritesList(listRes.data);
      }
    } catch (err) {
      console.error('Failed to load favorites', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavoriteIds();
  }, [fetchFavoriteIds]);

  const isFavorite = useCallback(
    (type, id) => {
      if (!type || !id) return false;
      return favoriteKeys.has(`${type.toUpperCase()}:${id}`);
    },
    [favoriteKeys]
  );

  const toggleFavorite = async (item) => {
    if (!user) {
      return { success: false, requireLogin: true };
    }

    const itemType = (item.itemType || 'PLACE').toUpperCase();
    const itemId = item.id || item.itemId;
    const key = `${itemType}:${itemId}`;
    const willSave = !favoriteKeys.has(key);

    // Optimistic UI update
    setFavoriteKeys((prev) => {
      const next = new Set(prev);
      if (willSave) next.add(key);
      else next.delete(key);
      return next;
    });

    try {
      const res = await API.post('/favorites/toggle', {
        itemType,
        itemId,
        title: item.name || item.title || '',
        subtitle: item.description || item.category || '',
        imageUrl: item.imageUrl || '',
        rating: item.rating || 0.0,
        priceInfo: item.pricePerNight ? `₹${item.pricePerNight}/night` : item.indicativePrice ? `₹${item.indicativePrice}` : item.entryFee ? `₹${item.entryFee}` : '',
        cityName: item.cityName || ''
      });

      // Refresh list in background
      const listRes = await API.get('/favorites');
      if (Array.isArray(listRes.data)) {
        setFavoritesList(listRes.data);
      }

      return { success: true, saved: res.data?.saved ?? willSave };
    } catch (err) {
      // Revert optimistic update
      setFavoriteKeys((prev) => {
        const next = new Set(prev);
        if (willSave) next.delete(key);
        else next.add(key);
        return next;
      });
      return { success: false, error: err.message };
    }
  };

  const removeFavorite = async (favoriteId, itemType, itemId) => {
    try {
      await API.delete(`/favorites/${favoriteId}`);
      if (itemType && itemId) {
        setFavoriteKeys((prev) => {
          const next = new Set(prev);
          next.delete(`${itemType.toUpperCase()}:${itemId}`);
          return next;
        });
      }
      setFavoritesList((prev) => prev.filter((f) => f.id !== favoriteId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteKeys,
        favoritesList,
        loading,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        refreshFavorites: fetchFavoriteIds
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
