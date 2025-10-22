import api from './api';
import { Location } from '../types';

export const locationService = {
  async getAll(): Promise<Location[]> {
    const response = await api.get('/locations');
    return response.data.data;
  },

  async getTree(): Promise<any[]> {
    const response = await api.get('/locations/tree');
    return response.data.data;
  },

  async getById(id: string): Promise<Location> {
    const response = await api.get(`/locations/${id}`);
    return response.data.data;
  },

  async create(data: any): Promise<Location> {
    const response = await api.post('/locations', data);
    return response.data.data;
  },

  async update(id: string, data: any): Promise<Location> {
    const response = await api.put(`/locations/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/locations/${id}`);
  }
};
