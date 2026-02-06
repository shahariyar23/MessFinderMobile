import api from './api';
import {
    DashboardStats,
    MessWithOwner,
    User,
    Booking,
    HomeSlider,
} from '../types';

// Dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data.data;
};

// Mess Management
export const getAllMesses = async (status?: 'pending' | 'approved' | 'rejected') => {
    const params = status && status !== 'all' ? { status } : {};
    const response = await api.get('/admin/messes', { params });
    return response.data.data;
};

export const approveMess = async (messId: string) => {
    const response = await api.patch(`/admin/messes/${messId}/approve`);
    return response.data.data;
};

export const rejectMess = async (messId: string, reason?: string) => {
    const response = await api.patch(`/admin/messes/${messId}/reject`, { reason });
    return response.data.data;
};

// User Management
export const getAllStudents = async (): Promise<User[]> => {
    const response = await api.get('/admin/users', { params: { role: 'student' } });
    return response.data.data;
};

export const getAllOwners = async (): Promise<User[]> => {
    const response = await api.get('/admin/users', { params: { role: 'owner' } });
    return response.data.data;
};

export const toggleUserStatus = async (userId: string, isActive: boolean) => {
    const response = await api.patch(`/admin/users/${userId}/status`, { isActive });
    return response.data.data;
};

// Booking Management
export const getAllBookings = async (
    status?: 'all' | 'pending' | 'confirmed' | 'cancelled'
): Promise<Booking[]> => {
    const params = status && status !== 'all' ? { status } : {};
    const response = await api.get('/admin/bookings', { params });
    return response.data.data;
};

// Payment Management
interface Payment {
    _id: string;
    user: { name: string; email: string };
    mess: { title: string };
    amount: number;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
    paymentMethod: string;
    createdAt: string;
}

export const getAllPayments = async (
    status?: 'all' | 'paid' | 'pending' | 'failed'
): Promise<Payment[]> => {
    const params = status && status !== 'all' ? { status } : {};
    const response = await api.get('/admin/payments', { params });
    return response.data.data;
};

// Homepage Management
export const addHomeSlider = async (sliderData: { image: string }): Promise<HomeSlider> => {
    const response = await api.post('/admin/home/sliders', sliderData);
    return response.data.data;
};

export const deleteHomeSlider = async (sliderId: string) => {
    const response = await api.delete(`/admin/home/sliders/${sliderId}`);
    return response.data;
};

export const getHomeSliders = async (): Promise<HomeSlider[]> => {
    const response = await api.get('/admin/home/sliders');
    return response.data.data;
};

export default {
    getDashboardStats,
    getAllMesses,
    approveMess,
    rejectMess,
    getAllStudents,
    getAllOwners,
    toggleUserStatus,
    getAllBookings,
    getAllPayments,
    addHomeSlider,
    deleteHomeSlider,
    getHomeSliders,
};
