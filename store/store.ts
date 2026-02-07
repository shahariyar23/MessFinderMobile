import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import messReducer from './slices/messSlice';
import favoriteReducer from './slices/favoriteSlice';
import bookingReducer from './slices/bookingSlice';
import reviewReducer from './slices/reviewSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        mess: messReducer,
        favorites: favoriteReducer,
        booking: bookingReducer,
        reviews: reviewReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
