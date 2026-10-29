import api from './api';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth';

export const authService = {
  async login(payload: LoginPayload): Promise<{ token: string; user: User }> {
    const response = await api.post<AuthResponse>('/login', payload);
    const data = response.data.data;
    if (!data?.access_token || !data?.user) {
      throw new Error(response.data.message?.error?.[0] || 'Login failed');
    }
    localStorage.setItem('akmoney_token', data.access_token);
    localStorage.setItem('akmoney_user', JSON.stringify(data.user));
    return { token: data.access_token, user: data.user };
  },

  async register(payload: RegisterPayload): Promise<{ token: string; user: User }> {
    const response = await api.post<AuthResponse>('/register', payload);
    const data = response.data.data;
    if (!data?.access_token || !data?.user) {
      throw new Error(response.data.message?.error?.[0] || 'Registration failed');
    }
    localStorage.setItem('akmoney_token', data.access_token);
    localStorage.setItem('akmoney_user', JSON.stringify(data.user));
    return { token: data.access_token, user: data.user };
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ data: { user: User } }>('/user-info');
    const user = response.data.data.user;
    localStorage.setItem('akmoney_user', JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    try {
      await api.get('/logout');
    } finally {
      localStorage.removeItem('akmoney_token');
      localStorage.removeItem('akmoney_user');
    }
  },

  async verifyPin(pin: string): Promise<boolean> {
    try {
      const response = await api.post<{ status: string }>('/transaction-pin/verify', { pin });
      return response.data.status === 'success';
    } catch {
      return false;
    }
  },

  async setPin(pin: string, pin_confirmation: string): Promise<void> {
    await api.post('/transaction-pin/store', { pin, pin_confirmation });
  },

  getUserFromStorage(): User | null {
    const raw = localStorage.getItem('akmoney_user');
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('akmoney_token');
  },
};
