import api from './api';
import { User, AuthTokens, LoginCredentials } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post('/auth/login', credentials);
    return response.data.data;
  },

  async register(data: { email: string; password: string; full_name: string }): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },
};
