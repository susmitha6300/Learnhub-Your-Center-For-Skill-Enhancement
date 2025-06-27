import axios from 'axios';
import { getToken, getRefreshToken, setTokens, removeTokens, isTokenExpired } from '../utils/auth';
import { handleApiError, retryRequest } from '../utils/api-helpers';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken && !isTokenExpired(refreshToken)) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          setTokens(accessToken, newRefreshToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          removeTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        removeTokens();
        window.location.href = '/login';
      }
    }

    // Log errors in development
    if (import.meta.env.DEV) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

// API methods with error handling
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      removeTokens();
    } catch (error) {
      // Even if logout fails on server, remove local tokens
      removeTokens();
      throw handleApiError(error);
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/auth/profile', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getEnrolledCourses: async () => {
    try {
      const response = await api.get('/auth/enrolled-courses');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export const coursesAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/courses', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  create: async (courseData) => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  update: async (id, courseData) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  enroll: async (id) => {
    try {
      const response = await api.post(`/courses/${id}/enroll`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateProgress: async (id, progressData) => {
    try {
      const response = await api.put(`/courses/${id}/progress`, progressData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  addReview: async (id, reviewData) => {
    try {
      const response = await api.post(`/courses/${id}/review`, reviewData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getTeacherCourses: async (params = {}) => {
    try {
      const response = await api.get('/courses/teacher/my-courses', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export const adminAPI = {
  getStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getCourses: async (params = {}) => {
    try {
      const response = await api.get('/admin/courses', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateCourseStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/admin/courses/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateUserStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/admin/users/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getEnrollmentAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/admin/analytics/enrollments', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getRevenueAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/admin/analytics/revenue', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export const uploadAPI = {
  uploadSingle: async (file, fieldName) => {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);
      
      const response = await api.post(`/upload/single/${fieldName}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  uploadCourseImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('courseImage', file);
      
      const response = await api.post('/upload/course-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.post('/users/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Utility function for retrying failed requests
export const apiWithRetry = (apiCall, maxRetries = 3) => {
  return retryRequest(apiCall, maxRetries);
};

export default api;
