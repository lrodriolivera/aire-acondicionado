import api from './api';
import { Brand } from '../types';

export const brandService = {
  async getAll(): Promise<Brand[]> {
    const response = await api.get('/brands');
    return response.data.data;
  },

  async getById(id: string): Promise<Brand> {
    const response = await api.get(`/brands/${id}`);
    return response.data.data;
  },

  async create(data: Partial<Brand>): Promise<Brand> {
    const response = await api.post('/brands', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<Brand>): Promise<Brand> {
    const response = await api.put(`/brands/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/brands/${id}`);
  }
};
