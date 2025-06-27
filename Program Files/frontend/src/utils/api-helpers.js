// API response helpers
export const handleApiResponse = (response) => {
  if (response.data.status === 'success') {
    return response.data.data;
  }
  throw new Error(response.data.message || 'API request failed');
};

export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 'Server error occurred';
    const status = error.response.status;
    return { message, status, type: 'server' };
  } else if (error.request) {
    // Request was made but no response received
    return { 
      message: 'Network error. Please check your connection.', 
      status: 0, 
      type: 'network' 
    };
  } else {
    // Something else happened
    return { 
      message: error.message || 'An unexpected error occurred', 
      status: 0, 
      type: 'unknown' 
    };
  }
};

// Request helpers
export const createFormData = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(key, item);
        } else {
          formData.append(`${key}[${index}]`, JSON.stringify(item));
        }
      });
    } else if (value !== null && value !== undefined) {
      formData.append(key, JSON.stringify(value));
    }
  });
  
  return formData;
};

// URL helpers
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  
  return searchParams.toString();
};

export const buildApiUrl = (endpoint, params = {}) => {
  const queryString = buildQueryString(params);
  return queryString ? `${endpoint}?${queryString}` : endpoint;
};

// Retry logic
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

// Cache helpers
export const createCacheKey = (endpoint, params = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {});
  
  return `${endpoint}_${JSON.stringify(sortedParams)}`;
};

export const isCacheValid = (timestamp, maxAge = 5 * 60 * 1000) => {
  return Date.now() - timestamp < maxAge;
};

// Debounce helper for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
