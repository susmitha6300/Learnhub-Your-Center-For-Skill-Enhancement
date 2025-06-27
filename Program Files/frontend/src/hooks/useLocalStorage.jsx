import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = storage.get(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      storage.set(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove from localStorage
  const removeValue = () => {
    try {
      storage.remove(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

// Specialized hooks for common use cases
export const useUserStorage = () => {
  return useLocalStorage('user', null);
};

export const useSettingsStorage = () => {
  return useLocalStorage('appSettings', {
    theme: 'light',
    notifications: true,
    autoSave: true
  });
};

export const useRecentSearches = () => {
  const [searches, setSearches, removeSearches] = useLocalStorage('recentSearches', []);
  
  const addSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    setSearches(prev => {
      const filtered = prev.filter(term => term !== searchTerm);
      return [searchTerm, ...filtered].slice(0, 10); // Keep only last 10 searches
    });
  };
  
  const clearSearches = () => {
    removeSearches();
  };
  
  return [searches, addSearch, clearSearches];
};
