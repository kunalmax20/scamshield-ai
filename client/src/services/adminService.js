import API from './api';

export const adminService = {
  getStatistics: async () => {
    const response = await API.get('/admin/statistics');
    return response.data;
  },

  getReports: async (status = 'ALL') => {
    const response = await API.get(`/admin/reports?status=${status}`);
    return response.data;
  },

  updateReportStatus: async (id, status) => {
    const response = await API.patch(`/admin/reports/${id}`, { status });
    return response.data;
  }
};
