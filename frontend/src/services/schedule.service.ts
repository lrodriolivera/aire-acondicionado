import api from './api';

export const scheduleService = {
  async getAll(filters?: any): Promise<any[]> {
    const response = await api.get('/schedules', { params: filters });
    return response.data.data;
  },

  async getById(id: string): Promise<any> {
    const response = await api.get(`/schedules/${id}`);
    return response.data.data;
  },

  async create(data: any): Promise<any> {
    const response = await api.post('/schedules', data);
    return response.data.data;
  },

  async update(id: string, data: any): Promise<any> {
    const response = await api.put(`/schedules/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/schedules/${id}`);
  },

  async toggle(id: string, enabled: boolean): Promise<any> {
    const response = await api.patch(`/schedules/${id}/toggle`, { enabled });
    return response.data.data;
  }
};
