import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BookingState, Booking, CreateBookingData } from '../../types';
import bookingService from '../../services/bookingService';

const initialState: BookingState = {
    bookings: [],
    currentBooking: null,
    isLoading: false,
    error: null,
    counts: undefined,
};

// Fetch user bookings
export const fetchUserBookings = createAsyncThunk(
    'booking/fetchUser',
    async (
        { page = 1, limit = 10, status, type }: { page?: number; limit?: number; status?: string; type?: 'upcoming' | 'past' },
        { rejectWithValue }
    ) => {
        try {
            const response = await bookingService.getUserBookings(page, limit, status, type);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch bookings');
        }
    }
);

// Fetch booking by ID
export const fetchBookingById = createAsyncThunk(
    'booking/fetchById',
    async (bookingId: string, { rejectWithValue }) => {
        try {
            const response = await bookingService.getBookingById(bookingId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch booking details');
        }
    }
);

// Create booking
export const createBooking = createAsyncThunk(
    'booking/create',
    async (data: CreateBookingData, { rejectWithValue }) => {
        try {
            const response = await bookingService.createBooking(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create booking');
        }
    }
);

// Cancel booking
export const cancelBooking = createAsyncThunk(
    'booking/cancel',
    async (bookingId: string, { rejectWithValue }) => {
        try {
            const response = await bookingService.cancelBooking(bookingId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to cancel booking');
        }
    }
);

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        clearCurrentBooking: (state) => {
            state.currentBooking = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch user bookings
        builder
            .addCase(fetchUserBookings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserBookings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bookings = action.payload.bookings || [];
                state.counts = action.payload.counts;
            })
            .addCase(fetchUserBookings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch booking by ID
        builder
            .addCase(fetchBookingById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchBookingById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentBooking = action.payload;
            })
            .addCase(fetchBookingById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Create booking
        builder
            .addCase(createBooking.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentBooking = action.payload;
                state.bookings.unshift(action.payload);
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Cancel booking
        builder
            .addCase(cancelBooking.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(cancelBooking.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.bookings.findIndex((b) => b._id === action.payload._id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
                if (state.currentBooking?._id === action.payload._id) {
                    state.currentBooking = action.payload;
                }
            })
            .addCase(cancelBooking.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCurrentBooking, clearError } = bookingSlice.actions;
export default bookingSlice.reducer;
