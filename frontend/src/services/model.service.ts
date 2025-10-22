import api from './api';
import { Model } from '../types';

export const modelService = {
  async getAll(filters?: any): Promise<Model[]> {
    const response = await api.get('/models', { params: filters });
    return response.data.data;
  },

  async getById(id: string): Promise<Model> {
    const response = await api.get(`/models/${id}`);
    return response.data.data;
  },

  async create(data: any): Promise<Model> {
    const response = await api.post('/models', data);
    return response.data.data;
  },

  async update(id: string, data: any): Promise<Model> {
    const response = await api.put(`/models/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/models/${id}`);
  }
};
