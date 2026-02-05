import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MessState, Mess, MessFilters, SavedMess } from '../../types';
import messService from '../../services/messService';

const initialState: MessState = {
    messes: [],
    currentMess: null,
    isLoading: false,
    error: null,
    pagination: null,
    filters: {},
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
                state.messes = action.payload.messes || [];
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
                state.messes = action.payload.messes || [];
                state.pagination = action.payload.pagination || null;
            })
            .addCase(searchMesses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCurrentMess, setFilters, clearFilters, clearError } = messSlice.actions;
export default messSlice.reducer;
