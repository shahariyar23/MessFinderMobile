import api from './api';
import { ApiResponse, Review, PaginatedResponse } from '../types';

export const reviewService = {
    // Get reviews by user
    async getUserReviews(page: number = 1, limit: number = 50): Promise<PaginatedResponse<Review>> {
        const response = await api.get(`/review/get-review-user?page=${page}&limit=${limit}`);
        return response.data;
    },
};

export default reviewService;
