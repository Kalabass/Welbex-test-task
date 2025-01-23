import { authService } from '@/api/services/auth.service';
import { getTokenFromLocalStorage, setTokenToLocalStorage } from '@/lib/tokens';
import { jwtDecode } from 'jwt-decode';

const isTokenExpired = (token: string) => {
  const { exp } = jwtDecode(token);
  return exp ? Date.now() >= exp * 1000 : false;
};

export const getValidToken = async () => {
  let token = getTokenFromLocalStorage();

  if (!token) return;

  if (isTokenExpired(token)) {
    try {
      const newToken = await authService.refresh();
      setTokenToLocalStorage(newToken.access_token);
      return newToken.access_token;
    } catch (error) {
      console.error('Error during refreshing tokens:', error);
      return;
    }
  }

  return token;
};
