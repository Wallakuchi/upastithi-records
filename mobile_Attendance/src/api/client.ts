import axios, { AxiosInstance } from 'axios';
import { getApiBaseUrl } from '../config/apiBaseUrl';
import { appStorage } from '../storage/appStorage';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: getApiBaseUrl(),
      timeout: 10000,
    });

    // Must read the same storage as `authStore` (login writes to MMKV, not AsyncStorage).
    this.client.interceptors.request.use((config) => {
      const token = appStorage.getString('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          appStorage.delete('authToken');
          appStorage.delete('refreshToken');
        }
        return Promise.reject(error);
      }
    );
  }

  get<T = any>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  delete<T = any>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }
}

export default new ApiClient();
