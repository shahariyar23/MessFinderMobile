import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { store } from '../store/store';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { checkAuthStatus, setRedirectPath, clearRedirectPath } from '../store/slices/authSlice';
import { Loading } from '../components/ui';


function RootLayoutNav() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const segments = useSegments();
    const { isAuthenticated, isLoading, user, redirectPath } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(checkAuthStatus());
    }, [dispatch]);

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inAdminGroup = segments[0] === '(admin)';

        // Define protected routes that require authentication
        const protectedRoutes = [
            '(admin)',
            'mess/', // mess details
            'booking/create',
            'booking/', // booking details
            'payment',
        ];

        // Check if current route is protected
        const currentPath = segments.join('/');
        const isProtectedRoute = protectedRoutes.some(route =>
            currentPath.startsWith(route)
        );

        // Not authenticated and trying to access protected route - redirect to login
        if (!isAuthenticated && !inAuthGroup && isProtectedRoute) {
            // Save the current path they were trying to access
            if (currentPath) {
                dispatch(setRedirectPath(`/${currentPath}`));
            }
            router.replace('/(auth)/login');
            return;
        }

        // Authenticated - handle role-based navigation
        if (isAuthenticated && user) {
            // If in auth screens, redirect based on role and redirectPath
            if (inAuthGroup) {
                // If there's a redirect path, go there
                if (redirectPath) {
                    router.replace(redirectPath as any);
                    dispatch(clearRedirectPath());
                } else {
                    // Role-based default redirect
                    if (user.role === 'admin') {
                        router.replace('/(admin)');
                    } else {
                        router.replace('/(tabs)');
                    }
                }
                return;
            }

            // Prevent non-admins from accessing admin routes
            if (inAdminGroup && user.role !== 'admin') {
                router.replace('/(tabs)');
                return;
            }

            // Redirect admin to admin panel if they try to access tabs
            if (segments[0] === '(tabs)' && user.role === 'admin') {
                router.replace('/(admin)');
                return;
            }
        }
    }, [isAuthenticated, isLoading, segments, user, redirectPath]);

    if (isLoading) {
        return <Loading fullScreen text="Loading..." />;
    }

    return (
        <>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(admin)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="mess/[id]"
                    options={{
                        headerShown: true,
                        title: 'Mess Details',
                        headerBackTitle: 'Back',
                    }}
                />
                <Stack.Screen
                    name="booking/create"
                    options={{
                        headerShown: true,
                        title: 'Book Mess',
                        presentation: 'modal',
                    }}
                />
                <Stack.Screen
                    name="booking/[id]"
                    options={{
                        headerShown: true,
                        title: 'Booking Details',
                    }}
                />
                <Stack.Screen
                    name="payment"
                    options={{
                        headerShown: true,
                        title: 'Payment',
                        presentation: 'fullScreenModal',
                    }}
                />
            </Stack>
            <Toast />
        </>
    );
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <RootLayoutNav />
            </SafeAreaProvider>
        </Provider>
    );
}
