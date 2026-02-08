import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MessState, Mess, MessFilters, SavedMess, HomeSlider } from '../../types';
import messService from '../../services/messService';

const initialState: MessState = {
    messes: [],
    currentMess: null,
    isLoading: false,
    error: null,
    pagination: null,
    filters: {},
    homeSliders: [],
};

// Fetch all messes
export const fetchMesses = createAsyncThunk(
    'mess/fetchAll',
    async ({ page = 1, limit = 10, filters }: { page?: number; limit?: number; filters?: MessFilters }, { rejectWithValue }) => {
        try {
            const response = await messService.getAllMesses(page, limit, filters);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch messes');
        }
    }
);

// Fetch mess by ID
export const fetchMessById = createAsyncThunk(
    'mess/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await messService.getMessById(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch mess details');
        }
    }
);

// Search messes
export const searchMesses = createAsyncThunk(
    'mess/search',
    async (
        { search, location, sortBy, sortOrder, page, limit }: {
            search?: string;
            location?: string;
            sortBy?: string;
            sortOrder?: 'asc' | 'desc';
            page?: number;
            limit?: number;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await messService.searchMesses(search, location, sortBy, sortOrder, page, limit);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Search failed');
        }
    }
);

// Fetch home page sliders
export const fetchHomeSliders = createAsyncThunk(
    'mess/fetchHomeSliders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await messService.getHomeSliders();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch home sliders');
        }
    }
);

const messSlice = createSlice({
    name: 'mess',
    initialState,
    reducers: {
        clearCurrentMess: (state) => {
            state.currentMess = null;
        },
        setFilters: (state, action: PayloadAction<MessFilters>) => {
            state.filters = action.payload;
        },
        clearFilters: (state) => {
            state.filters = {};
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch all messes
        builder
            .addCase(fetchMesses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMesses.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.meta.arg.page && action.meta.arg.page > 1) {
                    const newMesses = action.payload.messes || [];
                    const existingIds = new Set(state.messes.map((m) => m._id));
                    const uniqueNewMesses = newMesses.filter((m: Mess) => !existingIds.has(m._id));
                    state.messes = [...state.messes, ...uniqueNewMesses];
                } else {
                    state.messes = action.payload.messes || [];
                }
                state.pagination = action.payload.pagination || null;
            })
            .addCase(fetchMesses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch mess by ID
        builder
            .addCase(fetchMessById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMessById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentMess = action.payload;
                // Also update the mess in the list if it exists
                const index = state.messes.findIndex((m) => m._id === action.payload._id);
                if (index !== -1) {
                    state.messes[index] = action.payload;
                }
            })
            .addCase(fetchMessById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Search messes
        builder
            .addCase(searchMesses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchMesses.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.meta.arg.page && action.meta.arg.page > 1) {
                    const newMesses = action.payload.messes || [];
                    const existingIds = new Set(state.messes.map((m) => m._id));
                    const uniqueNewMesses = newMesses.filter((m: Mess) => !existingIds.has(m._id));
                    state.messes = [...state.messes, ...uniqueNewMesses];
                } else {
                    state.messes = action.payload.messes || [];
                }
                state.pagination = action.payload.pagination || null;
            })
            .addCase(searchMesses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch home sliders
        builder
            .addCase(fetchHomeSliders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchHomeSliders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.homeSliders = action.payload;
            })
            .addCase(fetchHomeSliders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCurrentMess, setFilters, clearFilters, clearError } = messSlice.actions;
export default messSlice.reducer;
