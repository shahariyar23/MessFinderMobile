import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Toast from 'react-native-toast-message';
import { Colors } from '../constants';

export default function PaymentScreen() {
    const { paymentUrl, bookingId } = useLocalSearchParams<{
        paymentUrl: string;
        bookingId: string;
    }>();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const handleNavigationChange = (navState: any) => {
        const { url } = navState;

        // Check for success
        if (url.includes('/payment/success') || url.includes('status=success')) {
            Toast.show({
                type: 'success',
                text1: 'Payment Successful!',
                text2: 'Your booking has been confirmed',
            });
            router.replace(`/booking/${bookingId}`);
            return;
        }

        // Check for failure
        if (url.includes('/payment/failed') || url.includes('status=failed')) {
            Toast.show({
                type: 'error',
                text1: 'Payment Failed',
                text2: 'Please try again',
            });
            router.back();
            return;
        }

        // Check for cancel
        if (url.includes('/payment/cancel') || url.includes('status=cancelled')) {
            Toast.show({
                type: 'info',
                text1: 'Payment Cancelled',
                text2: 'You can try again later',
            });
            router.back();
            return;
        }
    };

    if (!paymentUrl) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <Text className="text-gray-600">Payment URL not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Complete Payment',
                    headerBackVisible: false,
                }}
            />

            <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
                {loading && (
                    <View className="absolute top-0 left-0 right-0 bottom-0 bg-white items-center justify-center z-10">
                        <ActivityIndicator size="large" color={Colors.primary[500]} />
                        <Text className="text-gray-600 mt-4">Loading payment gateway...</Text>
                    </View>
                )}

                <WebView
                    source={{ uri: paymentUrl }}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    onNavigationStateChange={handleNavigationChange}
                    javaScriptEnabled
                    domStorageEnabled
                    startInLoadingState
                    scalesPageToFit
                    style={{ flex: 1 }}
                />
            </SafeAreaView>
        </>
    );
}
