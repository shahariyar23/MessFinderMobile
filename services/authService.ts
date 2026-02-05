import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../constants';
import {
    LoginCredentials,
    RegisterData,
    OTPVerifyData,
    User,
    ApiResponse
} from '../types';

export const authService = {
    // Register new user
    async register(data: RegisterData): Promise<ApiResponse<User>> {
        const response = await api.post('/user/register', data);
        return response.data;
    },

    // Login - Step 1: Request OTP
    async login(credentials: LoginCredentials): Promise<ApiResponse<{ otpRequired: boolean; email: string }>> {
        const response = await api.post('/user/login', credentials);
        return response.data;
    },

    // Verify OTP - Step 2: Complete login
    async verifyLogin(data: OTPVerifyData): Promise<ApiResponse<{ user: User; token?: string }>> {
        const response = await api.post('/user/verify-login', data);

        // For mobile, we expect token in response body
        // If using cookies, we'll need to extract from headers
        const token = response.data.data?.token ||
            response.headers['x-auth-token'] ||
            response.headers['authorization']?.replace('Bearer ', '');

        if (token) {
            await AsyncStorage.setItem(StorageKeys.AUTH_TOKEN, token);
        }

        if (response.data.data?.user) {
            await AsyncStorage.setItem(
                StorageKeys.USER_DATA,
                JSON.stringify(response.data.data.user)
            );
        }

        return response.data;
    },

    // Logout
    async logout(): Promise<void> {
        try {
            await api.post('/user/logout');
        } catch (error) {
            // Ignore logout API errors
        } finally {
            await AsyncStorage.removeItem(StorageKeys.AUTH_TOKEN);
            await AsyncStorage.removeItem(StorageKeys.USER_DATA);
        }
    },

    // Check authentication status
    async checkAuth(): Promise<ApiResponse<User>> {
        const response = await api.get('/user/check-auth');
        return response.data;
    },

    // Forgot password - request reset code
    async forgotPassword(email: string): Promise<ApiResponse<null>> {
        const response = await api.post('/user/forgot-password', { email });
        return response.data;
    },

    // Verify reset code
    async verifyResetCode(email: string, code: string): Promise<ApiResponse<{ resetToken: string }>> {
        const response = await api.post('/user/verify-code', { email, code });
        return response.data;
    },

    // Reset password
    async resetPassword(email: string, code: string, newPassword: string): Promise<ApiResponse<null>> {
        const response = await api.post('/user/reset-password', { email, code, newPassword });
        return response.data;
    },

    // Get stored user data
    async getStoredUser(): Promise<User | null> {
        try {
            const userData = await AsyncStorage.getItem(StorageKeys.USER_DATA);
            return userData ? JSON.parse(userData) : null;
        } catch {
            return null;
        }
    },

    // Check if token exists
    async hasToken(): Promise<boolean> {
        const token = await AsyncStorage.getItem(StorageKeys.AUTH_TOKEN);
        return !!token;
    },

    // Get student by ID
    async getStudentById(id: string): Promise<ApiResponse<User>> {
        const response = await api.get(`/user/get-student-id/${id}`);
        return response.data;
    },
};

export default authService;
