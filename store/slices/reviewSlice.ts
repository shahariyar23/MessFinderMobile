import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Review, Pagination } from '../../types';
import reviewService from '../../services/reviewService';

interface ReviewState {
    reviews: Review[];
    isLoading: boolean;
    error: string | null;
    pagination: Pagination | null;
}

const initialState: ReviewState = {
    reviews: [],
    isLoading: false,
    error: null,
    pagination: null,
};

// Fetch User Reviews
export const fetchUserReviews = createAsyncThunk(
    'reviews/fetchUserReviews',
    async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
        try {
            const response = await reviewService.getUserReviews(page, limit);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch reviews');
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        clearReviews: (state) => {
            state.reviews = [];
            state.pagination = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserReviews.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                // If page 1, replace reviews. If page > 1, append (logic handles in component or here?)
                // Usually for infinite scroll, we append. For simple pagination, we replace.
                // Given the requirement "page=1&limit=50", let's replace for now or handle append if pagination data suggests.
                // The API response structure in types.ts says `data: { messes?: T[], bookings?: T[], pagination: Pagination }`.
                // But reviewService returns `PaginatedResponse<Review>`.
                // Let's assume response.data has a `reviews` array.
                // Wait, PaginatedResponse definition in types.ts:
                // data: { messes?: T[]; bookings?: T[]; ... }
                // It doesn't have `reviews`. I might need to check the API response or update types.

                // Assuming the backend returns 'reviews' key for this endpoint.
                const data = action.payload as any;
                if (data.reviews) {
                    state.reviews = data.reviews;
                } else if (Array.isArray(data)) {
                    state.reviews = data;
                }

                if (data.pagination) {
                    state.pagination = data.pagination;
                }
            })
            .addCase(fetchUserReviews.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
