import api from './api';
import { TelemetryData } from '../types';

export const telemetryService = {
  async getByDevice(deviceId: string, params?: any): Promise<TelemetryData[]> {
    const response = await api.get(`/telemetry/device/${deviceId}`, { params });
    return response.data.data;
  },

  async getLatest(deviceId: string, limit: number = 100): Promise<TelemetryData[]> {
    const response = await api.get(`/telemetry/device/${deviceId}/latest`, {
      params: { limit }
    });
    return response.data.data;
  },

  async getAggregated(deviceId: string, params: any): Promise<any[]> {
    const response = await api.get(`/telemetry/device/${deviceId}/aggregated`, { params });
    return response.data.data;
  },

  async getConsumption(deviceId: string, days: number = 30): Promise<any> {
    const response = await api.get(`/telemetry/device/${deviceId}/consumption`, {
      params: { days }
    });
    return response.data.data;
  }
};
