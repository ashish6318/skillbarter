import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};

// Discovery API calls
export const discoverAPI = {
  getUsers: (params = {}) => api.get('/discover', { params }),
  searchUsers: (params = {}) => api.get('/discover/search', { params }),
  getCategories: () => api.get('/discover/categories'),
  getTrendingSkills: () => api.get('/discover/trending'),
  getUserProfile: (userId) => api.get(`/discover/${userId}`),
};

// Skills API calls
export const skillsAPI = {
  addSkillOffered: (skillData) => api.post('/skills/offered', skillData),
  removeSkillOffered: (skillId) => api.delete(`/skills/offered/${skillId}`),
  addSkillWanted: (skillData) => api.post('/skills/wanted', skillData),
  removeSkillWanted: (skillId) => api.delete(`/skills/wanted/${skillId}`),
  updateAvailability: (availability) => api.put('/skills/availability', { availability }),
};

// Messages API calls
export const messagesAPI = {
  getConversations: (params = {}) => api.get('/messages/conversations', { params }),
  getChatMessages: (userId, params = {}) => api.get(`/messages/${userId}`, { params }),
  sendMessage: (messageData) => api.post('/messages/send', messageData),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
};

// Sessions API calls
export const sessionsAPI = {
  getSessions: (params = {}) => api.get('/sessions', { params }),
  createSession: (sessionData) => api.post('/sessions/create', sessionData),
  updateSession: (sessionId, updates) => api.put(`/sessions/${sessionId}`, updates),
  cancelSession: (sessionId) => api.delete(`/sessions/${sessionId}`),
  startSession: (sessionId) => api.post(`/sessions/${sessionId}/start`),
  endSession: (sessionId) => api.post(`/sessions/${sessionId}/end`),
  submitReview: (sessionId, reviewData) => api.post(`/sessions/${sessionId}/review`, reviewData),
  getRoomDetails: (sessionId) => api.get(`/sessions/${sessionId}/room`),
};

// Credits API calls
export const creditsAPI = {
  getBalance: () => api.get('/credits/balance'),
  getTransactions: (params = {}) => api.get('/credits/transactions', { params }),
  getStats: () => api.get('/credits/stats'),
};

export default api;

// Direct exports for convenience
export const discoverUsers = (params = {}) => api.get('/discover', { params });
export const searchUsers = (params = {}) => api.get('/discover/search', { params });
