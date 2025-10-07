import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const patientsApi = {
  create: (data) => api.post('/patients', data),
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  update: (id, data) => api.put(`/patients/${id}`, data),
  remove: (id) => api.delete(`/patients/${id}`),
};

export const reportsApi = {
  create: (data) => api.post('/reports', data),
  getAll: () => api.get('/reports'),
  getById: (id) => api.get(`/reports/${id}`),
  update: (id, data) => api.put(`/reports/${id}`, data),
  remove: (id) => api.delete(`/reports/${id}`),
  pdfUrl: (id) => `${API_BASE_URL}/reports/${id}/pdf`,
  fetchPdfBlob: (id) => api.get(`/reports/${id}/pdf`, { responseType: 'blob' }),
  openPdf: async (id) => {
    // Open a blank tab synchronously to avoid popup blockers
    const win = window.open('', '_blank');
    if (!win) throw new Error('Popup blocked');
    win.document.write('<!doctype html><title>Loading PDF...</title><body style="font-family:sans-serif;padding:16px">Loading PDF...</body>');
    try {
      const res = await api.get(`/reports/${id}/pdf`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      // Navigate the opened tab to the blob URL
      win.location.href = url;
      // Revoke after some time to free memory
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      // Fallback: open the client-side view to allow printing
      win.location.href = `${window.location.origin}/reports/${id}`;
      throw err;
    }
  },
  downloadPdf: async (id) => {
    const res = await api.get(`/reports/${id}/pdf?download=1`, { responseType: 'blob' });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  },
  generatePdf: async (report, { download = true } = {}) => {
    const res = await api.post(`/reports/pdf${download ? '?download=1' : ''}`, report, { responseType: 'blob' });
    return res.data;
  },
};

export const statsApi = {
  get: () => api.get('/stats'),
};

const adminApi = {
  auth: authApi,
  patients: patientsApi,
  reports: reportsApi,
  stats: statsApi,
};

export default adminApi;


