import api from './api';
import { Alert } from '../types';

export const alertService = {
  async getAll(filters?: any): Promise<Alert[]> {
    const response = await api.get('/alerts', { params: filters });
    return response.data.data;
  },

  async getById(id: string): Promise<Alert> {
    const response = await api.get(`/alerts/${id}`);
    return response.data.data;
  },

  async acknowledge(id: string): Promise<Alert> {
    const response = await api.patch(`/alerts/${id}/acknowledge`);
    return response.data.data;
  },

  async resolve(id: string): Promise<Alert> {
    const response = await api.patch(`/alerts/${id}/resolve`);
    return response.data.data;
  },

  async getStats(): Promise<any> {
    const response = await api.get('/alerts/stats');
    return response.data.data;
  }
};
