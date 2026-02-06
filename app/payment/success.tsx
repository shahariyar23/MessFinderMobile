import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle } from 'lucide-react-native';
import { Colors } from '../../../constants';
import { Button } from '../../../components/ui';

export default function PaymentSuccess() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const bookingId = params.bookingId as string;
    const transactionId = params.transactionId as string;
    const amount = params.amount as string;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center px-6">
                {/* Success Icon */}
                <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
                    <CheckCircle size={56} color={Colors.success} />
                </View>

                {/* Title */}
                <Text className="text-2xl font-bold text-gray-800 mb-3">Payment Successful!</Text>
                <Text className="text-gray-500 text-center mb-8">
                    Your booking has been confirmed and payment processed successfully.
                </Text>

                {/* Details */}
                <View className="bg-gray-50 rounded-2xl p-6 w-full mb-8">
                    {amount && (
                        <View className="mb-4">
                            <Text className="text-sm text-gray-500 mb-1">Amount Paid</Text>
                            <Text className="text-2xl font-bold text-primary-600">৳{amount}</Text>
                        </View>
                    )}

                    {transactionId && (
                        <View className="mb-4">
                            <Text className="text-sm text-gray-500 mb-1">Transaction ID</Text>
                            <Text className="text-gray-800 font-medium">{transactionId}</Text>
                        </View>
                    )}

                    <View>
                        <Text className="text-sm text-gray-500 mb-1">Status</Text>
                        <View className="flex-row items-center">
                            <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                            <Text className="text-green-600 font-medium">Confirmed</Text>
                        </View>
                    </View>
                </View>

                {/* Actions */}
                <View className="w-full space-y-3">
                    {bookingId && (
                        <Button
                            title="View Booking Details"
                            onPress={() => router.push(`/booking/${bookingId}` as any)}
                        />
                    )}

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
