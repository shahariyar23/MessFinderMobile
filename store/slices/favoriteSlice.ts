import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FavoriteState, SavedMess } from '../../types';
import messService from '../../services/messService';

const initialState: FavoriteState = {
    savedMesses: [],
    isLoading: false,
    error: null,
};

// Fetch all saved messes
export const fetchSavedMesses = createAsyncThunk(
    'favorites/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await messService.getSavedMesses();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch saved messes');
        }
    }
);

// Save a mess
export const saveMess = createAsyncThunk(
    'favorites/save',
    async (messId: string, { rejectWithValue }) => {
        try {
            const response = await messService.saveMess(messId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to save mess');
        }
    }
);

// Remove saved mess
export const removeSavedMess = createAsyncThunk(
    'favorites/remove',
    async (messId: string, { rejectWithValue }) => {
        try {
            await messService.removeSavedMess(messId);
            return messId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to remove saved mess');
        }
    }
);

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch saved messes
        builder
            .addCase(fetchSavedMesses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSavedMesses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.savedMesses = action.payload || [];
            })
            .addCase(fetchSavedMesses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Save mess
        builder
            .addCase(saveMess.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(saveMess.fulfilled, (state, action) => {
                state.isLoading = false;
                state.savedMesses.push(action.payload);
            })
            .addCase(saveMess.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Remove saved mess
        builder
            .addCase(removeSavedMess.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(removeSavedMess.fulfilled, (state, action) => {
                state.isLoading = false;
                state.savedMesses = state.savedMesses.filter(
                    (item) => item.mess_id._id !== action.payload
                );
            })
            .addCase(removeSavedMess.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = favoriteSlice.actions;
export default favoriteSlice.reducer;
