import apiClient from './client';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from './types';

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register', data);
    return response.data;
  },

  /**
   * Login user and get access token
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // OAuth2 password flow expects form data
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const response = await apiClient.post<AuthResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Save token to localStorage
    localStorage.setItem('access_token', response.data.access_token);

    return response.data;
  },

  /**
   * Get current user info
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },
};
