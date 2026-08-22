import API from './api';

export const scanService = {
  scanText: async (text) => {
    const response = await API.post('/scan/text', { text });
    return response.data;
  },

  scanUrl: async (url) => {
    const response = await API.post('/scan/url', { url });
    return response.data;
  },

  scanImage: async (formData) => {
    const response = await API.post('/scan/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getScanById: async (id) => {
    const response = await API.get(`/scan/${id}`);
    return response.data;
  },

  getScanHistory: async () => {
    const response = await API.get('/scan/history');
    return response.data;
  }
};
