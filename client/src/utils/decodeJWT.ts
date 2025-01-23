import { jwtDecode } from 'jwt-decode';

export const decodeUserId = (token: string): number | null => {
  try {
    const decoded: { id?: number } = jwtDecode(token);
    return decoded.id || null;
  } catch {
    return null;
  }
};
