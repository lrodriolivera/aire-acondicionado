import api from './api';
import { Device, DeviceWithStatus, CommandPayload } from '../types';

export const deviceService = {
  async getAll(filters?: any): Promise<DeviceWithStatus[]> {
    const response = await api.get('/devices', { params: filters });
    return response.data.data;
  },

  async getById(id: string): Promise<DeviceWithStatus> {
    const response = await api.get(`/devices/${id}`);
    return response.data.data;
  },

  async create(data: any): Promise<Device> {
    const response = await api.post('/devices', data);
    return response.data.data;
  },

  async update(id: string, data: any): Promise<Device> {
    const response = await api.put(`/devices/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/devices/${id}`);
  },

  async getStats(): Promise<any> {
    const response = await api.get('/devices/stats');
    return response.data.data;
  },

  async sendCommand(payload: CommandPayload): Promise<void> {
    await api.post('/control/command', payload);
  },

  async refreshStatus(deviceId: string): Promise<void> {
    await api.post(`/control/refresh/${deviceId}`);
  }
};
