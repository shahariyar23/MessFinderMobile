import api from './api';
import {
    Mess,
    MessFilters,
    ApiResponse,
    SavedMess,
    HomeSlider,
    Review,
    CreateReviewData
} from '../types';

export const messService = {
    // Get all messes with pagination and filters
    async getAllMesses(page = 1, limit = 10, filters?: MessFilters): Promise<ApiResponse<any>> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (filters?.minPrice) params.append('minRating', filters.minPrice.toString());
        if (filters?.maxPrice) params.append('maxRating', filters.maxPrice.toString());

        const response = await api.get(`/mess/get-all-mess?${params.toString()}`);
        return response.data;
    },

    // Get mess details by ID
    async getMessById(id: string): Promise<ApiResponse<Mess>> {
        const response = await api.get(`/mess/get-mess-info/${id}`);
        return response.data;
    },

    // Get available (not booked) messes
    async getAvailableMesses(): Promise<ApiResponse<Mess[]>> {
        const response = await api.get('/mess/get-mess-not-booked');
        return response.data;
    },

    // Search messes with sorting
    async searchMesses(
        search?: string,
        location?: string,
        sortBy?: string,
        sortOrder?: 'asc' | 'desc',
        page = 1,
        limit = 10
    ): Promise<ApiResponse<any>> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (search) params.append('search', search);
        if (location) params.append('location', location);
        if (sortBy) params.append('sortBy', sortBy);
        if (sortOrder) params.append('sortOrder', sortOrder);

        const response = await api.get(`/mess/get-mess-search-with-sort?${params.toString()}`);
        return response.data;
    },

    // Get sorted messes
    async getSortedMesses(
        sortBy: string,
        sortOrder: 'asc' | 'desc',
        page = 1,
        limit = 10
    ): Promise<ApiResponse<any>> {
        const params = new URLSearchParams({
            sortBy,
            sortOrder,
            page: page.toString(),
            limit: limit.toString(),
        });

        const response = await api.get(`/mess/get-mess-sort?${params.toString()}`);
        return response.data;
    },

    // === Saved Mess (Favorites) ===

    // Get all saved messes
    async getSavedMesses(): Promise<ApiResponse<SavedMess[]>> {
        const response = await api.get('/mess/save/get-all');
        return response.data;
    },

    // Save a mess
    async saveMess(messId: string): Promise<ApiResponse<SavedMess>> {
        const response = await api.post(`/mess/save/add/${messId}`);
        return response.data;
    },

    // Remove saved mess
    async removeSavedMess(messId: string): Promise<ApiResponse<null>> {
        const response = await api.delete(`/mess/save/delete/${messId}`);
        return response.data;
    },

    // Check if mess is saved
    async checkIfSaved(messId: string): Promise<ApiResponse<{ isSaved: boolean }>> {
        const response = await api.get(`/mess/save/check/${messId}`);
        return response.data;
    },

    // === Reviews ===

    // Get reviews for a mess
    async getMessReviews(messId: string): Promise<ApiResponse<Review[]>> {
        const response = await api.get(`/review/get-review-mess/${messId}`);
        return response.data;
    },

    // Create a review
    async createReview(data: CreateReviewData): Promise<ApiResponse<Review>> {
        const response = await api.post('/review/create-review', data);
        return response.data;
    },

    // Get user's reviews
    async getUserReviews(): Promise<ApiResponse<Review[]>> {
        const response = await api.get('/review/get-review-user');
        return response.data;
    },

    // Update review
    async updateReview(reviewId: string, data: Partial<CreateReviewData>): Promise<ApiResponse<Review>> {
        const response = await api.post(`/review/update-review-id/${reviewId}`, data);
        return response.data;
    },

    // Delete review
    async deleteReview(reviewId: string): Promise<ApiResponse<null>> {
        const response = await api.get(`/review/delete-review-id/${reviewId}`);
        return response.data;
    },

    // Get review stats for mess
    async getReviewStats(messId: string): Promise<ApiResponse<any>> {
        const response = await api.get(`/review/get-reviewstatuts-mess/${messId}`);
        return response.data;
    },

    // === Home Slider ===

    // Get home page sliders
    async getHomeSliders(): Promise<ApiResponse<HomeSlider[]>> {
        const response = await api.get('/admin/get-home-page-slider');
        return response.data;
    },

    // === View Requests ===

    // Create view request
    async createViewRequest(messId: string): Promise<ApiResponse<any>> {
        const response = await api.get(`/request/add/${messId}`);
        return response.data;
    },

    // Get user's requests
    async getUserRequests(): Promise<ApiResponse<any[]>> {
        const response = await api.get('/request/get-all-request-user');
        return response.data;
    },

    // Increment mess view count (re-fetch the mess to trigger view increment on backend)
    async incrementMessView(messId: string): Promise<ApiResponse<any>> {
        // The backend typically increments view count when mess details are fetched
        // This is a silent call to ensure the view is counted
        const response = await api.get(`/mess/get-mess-info/${messId}`);
        return response.data;
    },
};

export default messService;
