import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { store } from '../store/store';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { checkAuthStatus } from '../store/slices/authSlice';
import { Loading } from '../components/ui';


function RootLayoutNav() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const segments = useSegments();
    const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(checkAuthStatus());
    }, [dispatch]);

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!isAuthenticated && !inAuthGroup) {
            // Redirect to login if not authenticated
            router.replace('/(auth)/login');
        } else if (isAuthenticated && inAuthGroup) {
            // Redirect to home if authenticated but in auth screens
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, isLoading, segments]);

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
