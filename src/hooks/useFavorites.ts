import { useState, useEffect } from 'react';
import { Vehicle } from '../types';

const STORAGE_KEY = 'favoriteVehicles';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (vehicle: Vehicle) => {
    setFavorites(prev => [...prev, vehicle]);
  };

  const removeFromFavorites = (vehicleId: string) => {
    setFavorites(prev => prev.filter(v => v.id !== vehicleId));
  };

  const isInFavorites = (vehicleId: string) => {
    return favorites.some(v => v.id === vehicleId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    clearFavorites
  };
};