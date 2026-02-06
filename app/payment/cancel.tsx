import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircle } from 'lucide-react-native';
import { Colors } from '../../constants';
import { Button } from '../../components/ui';

export default function PaymentCancel() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center px-6">
                {/* Cancel Icon */}
                <View className="w-24 h-24 bg-yellow-100 rounded-full items-center justify-center mb-6">
                    <AlertCircle size={56} color={Colors.warning} />
                </View>

                {/* Title */}
                <Text className="text-2xl font-bold text-gray-800 mb-3">Payment Cancelled</Text>
                <Text className="text-gray-500 text-center mb-8">
                    You cancelled the payment. Your booking is still pending.
                </Text>

                {/* Info */}
                <View className="bg-yellow-50 rounded-2xl p-4 w-full mb-8">
                    <Text className="text-gray-700 text-center">
                        You can complete the payment later from your bookings page.
                    </Text>
                </View>

                {/* Actions */}
                <View className="w-full space-y-3">
                    <Button
                        title="View My Bookings"
                        onPress={() => router.push('/(tabs)/bookings')}
                    />

                    <Button
                        title="Go to Home"
                        onPress={() => router.push('/(tabs)')}
                        variant="outline"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
