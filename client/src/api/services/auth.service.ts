import { API_ENDPOINTS } from '@/const/APIEndpoints';
import { LoginData } from '@/types/login';
import { authInstance } from '../axios.instance';

interface TokenResponse {
  access_token: string;
}

class AuthService {
  async login(loginData: LoginData): Promise<TokenResponse> {
    try {
      const response = await authInstance.post(
        API_ENDPOINTS.AUTH.LOGIN,
        loginData
      );
      return response.data;
    } catch (error) {
      console.error('Failed to login', error);
      throw error;
    }
  }
  async reg(loginData: LoginData): Promise<TokenResponse> {
    try {
      const response = await authInstance.post(
        API_ENDPOINTS.AUTH.REG,
        loginData
      );
      return response.data;
    } catch (error) {
      console.error('Failed to register', error);
      throw error;
    }
  }
  async refresh(): Promise<TokenResponse> {
    try {
      const response = await authInstance.post(API_ENDPOINTS.AUTH.REFRESH);

      return response.data;
    } catch (error) {
      console.error('Failed to refresh tokens', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
