import api from './api';
import {
    Booking,
    CreateBookingData,
    ApiResponse,
    PaymentInitResponse,
    CustomerInfo
} from '../types';

export const bookingService = {
    // Create a new booking
    async createBooking(data: CreateBookingData): Promise<ApiResponse<Booking>> {
        const response = await api.post('/booking/create-booking', data);
        return response.data;
    },

    // Get user's bookings
    async getUserBookings(
        page = 1,
        limit = 10,
        status?: string,
        type?: 'upcoming' | 'past'
    ): Promise<ApiResponse<any>> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (status) params.append('status', status);
        if (type) params.append('type', type);

        const response = await api.get(`/booking/get-user-booking?${params.toString()}`);
        return response.data;
    },

    // Get booking details
    async getBookingById(bookingId: string): Promise<ApiResponse<Booking>> {
        const response = await api.get(`/booking/get-booking-info/${bookingId}`);
        return response.data;
    },

    // Cancel booking
    async cancelBooking(bookingId: string): Promise<ApiResponse<Booking>> {
        const response = await api.patch(`/booking/cancel-booking/${bookingId}`);
        return response.data;
    },

    // === Owner Booking Functions ===

    // Get owner's bookings
    async getOwnerBookings(
        ownerId: string,
        page = 1,
        limit = 10,
        type?: 'upcoming' | 'past'
    ): Promise<ApiResponse<any>> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (type) params.append('type', type);

        const response = await api.get(`/booking/get-owner-booking/${ownerId}?${params.toString()}`);
        return response.data;
    },

    // Update booking status (owner only)
    async updateBookingStatus(
        bookingId: string,
        bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'rejected' | 'completed'
    ): Promise<ApiResponse<Booking>> {
        const response = await api.patch(`/booking/update-booking-status/${bookingId}`, {
            bookingStatus,
        });
        return response.data;
    },

    // === Payment Functions ===

    // Initiate SSLCommerz payment
    async initiatePayment(
        bookingId: string,
        customerInfo: CustomerInfo
    ): Promise<ApiResponse<PaymentInitResponse>> {
        const response = await api.post('/payment/ssl-initiate', {
            bookingId,
            customerInfo,
        });
        return response.data;
    },

    // Validate payment
    async validatePayment(transactionId: string): Promise<ApiResponse<any>> {
        const response = await api.get(`/payment/validate/${transactionId}`);
        return response.data;
    },

    // Auto confirm payment
    async autoConfirmPayment(transactionId: string): Promise<ApiResponse<any>> {
        const response = await api.post('/payment/auto-confirm', { transactionId });
        return response.data;
    },
};

export default bookingService;
