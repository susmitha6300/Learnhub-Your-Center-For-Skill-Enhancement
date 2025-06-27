// Safe localStorage operations with error handling
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  // Check if localStorage is available
  isAvailable: () => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
};

// Specific storage functions for app data
export const userStorage = {
  getUser: () => storage.get('user'),
  setUser: (user) => storage.set('user', user),
  removeUser: () => storage.remove('user'),
};

export const courseStorage = {
  getCachedCourses: () => storage.get('cachedCourses', []),
  setCachedCourses: (courses) => storage.set('cachedCourses', courses),
  getLastFetch: () => storage.get('coursesLastFetch'),
  setLastFetch: (timestamp) => storage.set('coursesLastFetch', timestamp),
  clearCache: () => {
    storage.remove('cachedCourses');
    storage.remove('coursesLastFetch');
  }
};

export const settingsStorage = {
  getSettings: () => storage.get('appSettings', {
    theme: 'light',
    notifications: true,
    autoSave: true
  }),
  setSettings: (settings) => storage.set('appSettings', settings),
  updateSetting: (key, value) => {
    const settings = settingsStorage.getSettings();
    settings[key] = value;
    settingsStorage.setSettings(settings);
  }
};
