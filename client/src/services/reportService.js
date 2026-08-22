import API from './api';

export const reportService = {
  createReport: async (reportData) => {
    const response = await API.post('/reports', reportData);
    return response.data;
  },

  getMyReports: async () => {
    const response = await API.get('/reports/my');
    return response.data;
  }
};
