import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, StorageKeys } from '../constants';

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach token
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const token = await AsyncStorage.getItem(StorageKeys.AUTH_TOKEN);
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting token:', error);
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - clear token and redirect to login
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem(StorageKeys.AUTH_TOKEN);
            await AsyncStorage.removeItem(StorageKeys.USER_DATA);
            // Navigation to login will be handled by auth state change
        }

        // Handle network errors
        if (!error.response) {
            return Promise.reject({
                success: false,
                message: 'Network error. Please check your connection.',
                error: error.message,
            });
        }

        // Handle API errors
        const errorMessage = (error.response?.data as any)?.message ||
            'Something went wrong. Please try again.';

        return Promise.reject({
            success: false,
            message: errorMessage,
            statusCode: error.response?.status,
            error: error.response?.data,
        });
    }
);

export default api;
