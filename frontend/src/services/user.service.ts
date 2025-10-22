import api from './api';

export const userService = {
  async getAll(): Promise<any[]> {
    const response = await api.get('/users');
    return response.data.data;
  },

  async getById(id: string): Promise<any> {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  async create(data: any): Promise<any> {
    const response = await api.post('/users', data);
    return response.data.data;
  },

  async update(id: string, data: any): Promise<any> {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async toggleStatus(id: string, isActive: boolean): Promise<any> {
    const response = await api.patch(`/users/${id}/status`, { is_active: isActive });
    return response.data.data;
  }
};
