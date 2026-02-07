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
            console.log('📋 getSavedMesses API response:', JSON.stringify(response, null, 2));

            // Handle different API response formats
            let savedMesses = response.data;

            // If response.data is an object with savedMesses property
            if (savedMesses && !Array.isArray(savedMesses) && (savedMesses as any).savedMesses) {
                savedMesses = (savedMesses as any).savedMesses;
            }

            // Ensure we always return an array
            if (!Array.isArray(savedMesses)) {
                console.log('⚠️ savedMesses is not an array, returning empty array');
                return [];
            }

            console.log('✅ Returning', savedMesses.length, 'saved messes');
            return savedMesses;
        } catch (error: any) {
            console.log('❌ fetchSavedMesses error:', error.message);
            return rejectWithValue(error.message || 'Failed to fetch saved messes');
        }
    }
);

// Save a mess
export const saveMess = createAsyncThunk(
    'favorites/save',
    async (messId: string, { rejectWithValue, dispatch }) => {
        try {
            const response = await messService.saveMess(messId);
            console.log('💾 saveMess API response:', JSON.stringify(response, null, 2));
            // Refetch all saved messes to ensure UI is in sync
            dispatch(fetchSavedMesses());
            return response.data;
        } catch (error: any) {
            console.log('❌ saveMess error:', error.message);
            return rejectWithValue(error.message || 'Failed to save mess');
        }
    }
);

// Remove saved mess
export const removeSavedMess = createAsyncThunk(
    'favorites/remove',
    async (messId: string, { rejectWithValue, dispatch }) => {
        try {
            await messService.removeSavedMess(messId);
            // Refetch all saved messes to ensure UI is in sync
            dispatch(fetchSavedMesses());
            return messId;
        } catch (error: any) {
            console.log('❌ removeSavedMess error:', error.message);
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
                state.savedMesses = []; // Ensure it's always an array
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
                state.savedMesses = state.savedMesses.filter((item) => {
                    // Handle both mess_id and mess properties
                    const messData = (item as any).mess || item.mess_id;
                    const itemMessId = typeof messData === 'object' ? messData?._id : messData;
                    return itemMessId !== action.payload;
                });
            })
            .addCase(removeSavedMess.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = favoriteSlice.actions;
export default favoriteSlice.reducer;
