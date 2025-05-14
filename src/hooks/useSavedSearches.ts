import { useState, useEffect } from 'react';
import { SavedSearch } from '../types';

const STORAGE_KEY = 'savedSearches';

export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSearches));
  }, [savedSearches]);

  const saveSearch = (name: string, filters: SavedSearch['filters']) => {
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name,
      filters,
      createdAt: new Date().toISOString(),
      notificationsEnabled: true
    };
    setSavedSearches(prev => [...prev, newSearch]);
  };

  const updateSearch = (id: string, updates: Partial<SavedSearch>) => {
    setSavedSearches(prev => 
      prev.map(search => 
        search.id === id ? { ...search, ...updates } : search
      )
    );
  };

  const deleteSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== id));
  };

  const toggleNotifications = (id: string) => {
    setSavedSearches(prev => 
      prev.map(search => 
        search.id === id 
          ? { ...search, notificationsEnabled: !search.notificationsEnabled }
          : search
      )
    );
  };

  return {
    savedSearches,
    saveSearch,
    updateSearch,
    deleteSearch,
    toggleNotifications
  };
};