import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
let isRedirecting = false; // Prevent multiple redirects

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log all axios errors for debugging
    if (error.response) {
      // Server responded with error status
      console.error('❌ API Error:', {
        status: error.response.status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response.data
      });
    } else if (error.request) {
      // Request made but no response
      console.error('❌ Network Error - No response from server:', {
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
    } else {
      // Something else happened
      console.error('❌ Request Error:', error.message);
    }

    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register' || currentPath === '/';
      
      localStorage.removeItem('token');
      
      if (!isAuthPage && !isRedirecting) {
        isRedirecting = true;
        setTimeout(() => {
          window.location.href = '/login';
          isRedirecting = false;
        }, 500);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/signin', credentials),
  register: (userData) => api.post('/auth/signup', userData),
  getCurrentUser: () => api.get('/auth/me'),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
  resendVerification: (email) => api.post('/auth/resend-verification', null, {
    params: { email }
  }),
};

// Reports API
export const reportsAPI = {
  createReport: (reportData, images) => {
    const formData = new FormData();
    formData.append('report', new Blob([JSON.stringify(reportData)], { type: 'application/json' }));
    
    if (images) {
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });
    }
    
    // Let the browser set the correct multipart boundary
    return api.post('/reports', formData);
  },
  
  getReports: (params) => api.get('/reports', { params }),
  getReportById: (id) => api.get(`/reports/${id}`),
  getReportsByUser: (userId) => api.get(`/reports/user/${userId}`),
  updateReportStatus: (id, status, assignedWorkerId) => 
    api.put(`/reports/${id}/status`, null, {
      params: { status, assignedWorkerId }
    }),
  getReportsNearby: (latitude, longitude, radius) => 
    api.get('/reports/nearby', {
      params: { latitude, longitude, radius }
    }),
};

// Bins API
export const binsAPI = {
  getBins: () => api.get('/bins'),
  createBin: (data) => api.post('/bins', data),
  getNearest: (latitude, longitude, maxFill = 0.7) =>
    api.get('/bins/nearest', { params: { latitude, longitude, maxFill } }),
};

// Areas API
export const areasAPI = {
  getAreas: () => api.get('/areas'),
  getAreaById: (id) => api.get(`/areas/${id}`),
};

// Users API
export const usersAPI = {
  getUsers: () => api.get('/users'),
  getWorkers: () => api.get('/users/workers'),
};

// Collection Schedules API
export const schedulesAPI = {
  getSchedules: () => api.get('/schedules'),
  getSchedulesByArea: (areaId) => api.get(`/schedules/area/${areaId}`),
  getSchedulesByDay: (dayOfWeek) => api.get(`/schedules/day/${dayOfWeek}`),
  createSchedule: (data) => api.post('/schedules', data),
  updateSchedule: (id, data) => api.put(`/schedules/${id}`, data),
  deleteSchedule: (id) => api.delete(`/schedules/${id}`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: () => api.get('/notifications'),
  getUnreadNotifications: () => api.get('/notifications/unread'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export default api;
