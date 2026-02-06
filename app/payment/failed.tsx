import React from 'react';
import { View, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { XCircle } from 'lucide-react-native';
import { Colors } from '../../constants';
import { Button } from '../../components/ui';

export default function PaymentFailed() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const error = params.error as string;
    const bookingId = params.bookingId as string;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center px-6">
                {/* Error Icon */}
                <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
                    <XCircle size={56} color={Colors.error} />
                </View>

                {/* Title */}
                <Text className="text-2xl font-bold text-gray-800 mb-3">Payment Failed</Text>
                <Text className="text-gray-500 text-center mb-8">
                    We couldn't process your payment. Please try again.
                </Text>

                {/* Error Details */}
                {error && (
                    <View className="bg-red-50 rounded-2xl p-4 w-full mb-8">
                        <Text className="text-sm font-medium text-gray-700 mb-1">Error Details</Text>
                        <Text className="text-red-600">{error}</Text>
                    </View>
                )}

                {/* Actions */}
                <View className="w-full space-y-3">
                    {bookingId && (
                        <Button
                            title="Retry Payment"
                            onPress={() => router.push(`/booking/${bookingId}` as any)}
                        />
                    )}

                    <Button
                        title="Go to Home"
                        onPress={() => router.push('/(tabs)')}
                        variant="outline"
                    />

                    <Button
                        title="Contact Support"
                        onPress={() => router.push('/(tabs)/about' as any)}
                        variant="ghost"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
