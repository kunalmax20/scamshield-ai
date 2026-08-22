import API from './api';

export const authService = {
  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    if (response.data.data.token) {
      localStorage.setItem('scamshield_token', response.data.data.token);
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    if (response.data.data.token) {
      localStorage.setItem('scamshield_token', response.data.data.token);
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('scamshield_token');
  }
};
