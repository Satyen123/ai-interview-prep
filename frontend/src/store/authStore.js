import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../config';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  // Initialize axios headers
  setAuthHeader: (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  register: async (name, email, password, targetRole) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, targetRole });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      get().setAuthHeader(token);

      set({ user: userData, token, loading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed. Try again.', 
        loading: false 
      });
      return false;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, ...userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      get().setAuthHeader(token);

      set({ user: userData, token, loading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Invalid email or password.', 
        loading: false 
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    get().setAuthHeader(null);
    set({ user: null, token: null, error: null });
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      get().setAuthHeader(get().token);
      const response = await axios.put(`${API_URL}/auth/me`, profileData);
      const { token, ...userData } = response.data;

      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData, loading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Profile update failed.', 
        loading: false 
      });
      return false;
    }
  },

  fetchUserProfile: async () => {
    try {
      get().setAuthHeader(get().token);
      const response = await axios.get(`${API_URL}/auth/me`);
      localStorage.setItem('user', JSON.stringify(response.data));
      set({ user: response.data });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  },

  upgradeToPremium: async (plan) => {
    set({ loading: true, error: null });
    try {
      get().setAuthHeader(get().token);
      const response = await axios.put(`${API_URL}/auth/upgrade`, { plan });
      const { token, ...userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      get().setAuthHeader(token);

      set({ user: userData, token, loading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Upgrade to premium failed.', 
        loading: false 
      });
      return false;
    }
  },

  clearError: () => set({ error: null })
}));

// Set token initially if saved
const initialToken = localStorage.getItem('token');
if (initialToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}
