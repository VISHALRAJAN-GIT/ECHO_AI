import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customers API
export const customerAPI = {
  getAll: (skip = 0, limit = 100) => 
    api.get(`/customers/?skip=${skip}&limit=${limit}`),
  
  getById: (id) => 
    api.get(`/customers/${id}`),
  
  create: (data) => 
    api.post('/customers/', data),
  
  update: (id, data) => 
    api.put(`/customers/${id}`, data),
  
  delete: (id) => 
    api.delete(`/customers/${id}`),
};

// Tickets API
export const ticketAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/tickets/${queryParams ? '?' + queryParams : ''}`);
  },
  
  getById: (id) => 
    api.get(`/tickets/${id}`),
  
  create: (data) => 
    api.post('/tickets/', data),
  
  update: (id, data) => 
    api.put(`/tickets/${id}`, data),
  
  delete: (id) => 
    api.delete(`/tickets/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => 
    api.get('/analytics/dashboard'),
  
  getTicketAnalytics: () => 
    api.get('/analytics/tickets'),
  
  getConversationAnalytics: () => 
    api.get('/analytics/conversations'),
};

export default api;
