import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User, LoginCredentials, RegisterData, OTPVerifyData } from '../../types';
import { StorageKeys } from '../../constants';
import authService from '../../services/authService';

const initialState: AuthState & { redirectPath: string | null } = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    otpRequired: false,
    otpEmail: null,
    redirectPath: null, // Track where user was trying to go before login
};

// Check if user is authenticated on app start
export const checkAuthStatus = createAsyncThunk(
    'auth/checkStatus',
    async (_, { rejectWithValue }) => {
        try {
            const hasToken = await authService.hasToken();
            if (!hasToken) {
                return { isAuthenticated: false, user: null };
            }

            const response = await authService.checkAuth();
            if (response.success) {
                return { isAuthenticated: true, user: response.data };
            }
            return { isAuthenticated: false, user: null };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Authentication check failed');
        }
    }
);

// Register
export const register = createAsyncThunk(
    'auth/register',
    async (data: RegisterData, { rejectWithValue }) => {
        try {
            const response = await authService.register(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Registration failed');
        }
    }
);

// Login - Step 1: Request OTP
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            console.log(credentials, "login credentials");
            const response = await authService.login(credentials);

            console.log(response, "login response");
            return { ...response.data, email: credentials.email };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

// Verify OTP - Step 2: Complete login
export const verifyOTP = createAsyncThunk(
    'auth/verifyOTP',
    async (data: OTPVerifyData, { rejectWithValue }) => {
        try {
            const response = await authService.verifyLogin(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'OTP verification failed');
        }
    }
);

// Logout
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
            return null;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await authService.forgotPassword(email);
            return { email, message: response.message };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to send reset code');
        }
    }
);

// Reset Password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ email, code, newPassword }: { email: string; code: string; newPassword: string }, { rejectWithValue }) => {
        try {
            const response = await authService.resetPassword(email, code, newPassword);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to reset password');
        }
    }
);

// Update Profile
export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async ({ id, data }: { id: string; data: { name: string } }, { rejectWithValue }) => {
        try {
            const response = await authService.updateProfile(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update profile');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearOTPState: (state) => {
            state.otpRequired = false;
            state.otpEmail = null;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        setRedirectPath: (state, action: PayloadAction<string>) => {
            state.redirectPath = action.payload;
        },
        clearRedirectPath: (state) => {
            state.redirectPath = null;
        },
    },
    extraReducers: (builder) => {
        // Check Auth Status
        builder
            .addCase(checkAuthStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = action.payload.isAuthenticated;
                state.user = action.payload.user;
            })
            .addCase(checkAuthStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
            });

        // Register
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false;
                // After register, user needs to login
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Login (OTP Request)
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.otpRequired = true;
                state.otpEmail = action.payload.email;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Verify OTP
        builder
            .addCase(verifyOTP.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.otpRequired = false;
                state.otpEmail = null;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Logout
        builder
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.otpRequired = false;
                state.otpEmail = null;
            });

        // Forgot Password
        builder
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Reset Password
        builder
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update Profile
        builder
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, clearOTPState, setUser, setRedirectPath, clearRedirectPath } = authSlice.actions;
export default authSlice.reducer;
