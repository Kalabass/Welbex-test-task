import { getValidToken } from '@/utils/getValidToken';
import axios from 'axios';

const authInstance = axios.create({
  baseURL: import.meta.env.VITE_INSTANCE_BASE_URL,
  withCredentials: true,
});

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_INSTANCE_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getValidToken();

    if (!token) {
      return config;
    }

    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { authInstance, axiosInstance };
