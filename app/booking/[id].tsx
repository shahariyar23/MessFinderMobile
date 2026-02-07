import React, { useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Linking,
    Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ChevronLeft,
    MapPin,
    Calendar,
    Phone,
    Mail,
    User,
    CreditCard,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Button, Loading, Badge, Avatar } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchBookingById, cancelBooking } from '../../store/slices/bookingSlice';
import { Colors, BookingStatusColors, PaymentStatusColors } from '../../constants';
import { Mess, User as UserType } from '../../types';

export default function BookingDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { currentBooking, isLoading } = useAppSelector((state) => state.booking);

    useEffect(() => {
        if (id) {
            dispatch(fetchBookingById(id));
        }
    }, [id]);

    const handleCancel = () => {
        Alert.alert(
            'Cancel Booking',
            'Are you sure you want to cancel this booking? This action cannot be undone.',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await dispatch(cancelBooking(id!)).unwrap();
                            Toast.show({
                                type: 'success',
                                text1: 'Booking Cancelled',
                                text2: 'Your booking has been cancelled',
                            });
                        } catch (err: any) {
                            Toast.show({
                                type: 'error',
                                text1: 'Failed',
                                text2: err || 'Could not cancel booking',
                            });
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
            case 'completed':
                return <CheckCircle size={20} color={Colors.success} />;
            case 'pending':
                return <Clock size={20} color={Colors.warning} />;
            case 'cancelled':
            case 'rejected':
                return <XCircle size={20} color={Colors.error} />;
            default:
                return <AlertCircle size={20} color={Colors.gray[500]} />;
        }
    };

    if (isLoading || !currentBooking) {
        return <Loading fullScreen text="Loading booking..." />;
    }

    const mess = currentBooking.mess_id as Mess;
    const owner = currentBooking.owner_id as UserType;
    const canCancel =
        currentBooking.bookingStatus === 'pending' &&
        currentBooking.paymentStatus !== 'paid';
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Booking Details',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 rounded-full items-center justify-center"
                        >
                            <ChevronLeft size={24} color={Colors.gray[800]} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView className="flex-1 bg-gray-50">
                {/* Status Banner */}
                <View
                    className="px-5 py-4 flex-row items-center"
                    style={{
                        backgroundColor:
                            BookingStatusColors[currentBooking.bookingStatus] + '20',
                    }}
                >
                    {getStatusIcon(currentBooking.bookingStatus)}
                    <View className="ml-3">
                        <Text className="text-gray-800 font-semibold capitalize">
                            Booking {currentBooking.bookingStatus}
                        </Text>
                        <Text className="text-gray-600 text-sm">
                            {currentBooking.bookingStatus === 'pending'
                                ? 'Waiting for owner confirmation'
                                : currentBooking.bookingStatus === 'confirmed'
                                    ? 'Your booking is confirmed!'
                                    : 'Booking cancelled'}
                        </Text>
                    </View>
                </View>

                {/* Mess Info */}
                <View className="bg-white p-4 flex-row items-center mt-2">
                    <Image
                        source={{ uri: mess?.image?.[0]?.url || 'https://via.placeholder.com/100' }}
                        className="w-20 h-20 rounded-xl"
                        resizeMode="cover"
                    />
                    <View className="flex-1 ml-4">
                        <Text className="text-gray-800 font-semibold text-lg" numberOfLines={1}>
                            {mess?.title}
                        </Text>
                        <View className="flex-row items-center mt-1">
                            <MapPin size={14} color={Colors.gray[500]} />
                            <Text className="text-gray-500 text-sm ml-1" numberOfLines={1}>
                                {mess?.address}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Booking Details */}
                <View className="bg-white rounded-2xl mx-4 mt-4 p-4">
                    <Text className="text-gray-800 font-semibold text-lg mb-4">
                        Booking Details
                    </Text>

                    <View className="flex-row items-center mb-4">
                        <Calendar size={18} color={Colors.primary[500]} />
                        <View className="ml-3">
                            <Text className="text-gray-500 text-sm">Check-in Date</Text>
                            <Text className="text-gray-800 font-medium">
                                {formatDate(currentBooking.checkInDate)}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center mb-4">
                        <User size={18} color={Colors.primary[500]} />
                        <View className="ml-3">
                            <Text className="text-gray-500 text-sm">Tenant Name</Text>
                            <Text className="text-gray-800 font-medium">
                                {currentBooking.tenantName}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center mb-4">
                        <Phone size={18} color={Colors.primary[500]} />
                        <View className="ml-3">
                            <Text className="text-gray-500 text-sm">Contact Phone</Text>
                            <Text className="text-gray-800 font-medium">
                                {currentBooking.tenantPhone}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <Mail size={18} color={Colors.primary[500]} />
                        <View className="ml-3">
                            <Text className="text-gray-500 text-sm">Email</Text>
                            <Text className="text-gray-800 font-medium">
                                {currentBooking.tenantEmail}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Emergency Contact */}
                {currentBooking.emergencyContact && (
                    <View className="bg-white rounded-2xl mx-4 mt-4 p-4">
                        <Text className="text-gray-800 font-semibold text-lg mb-4">
                            Emergency Contact
                        </Text>
                        <Text className="text-gray-800">
                            {currentBooking.emergencyContact.name}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                            {currentBooking.emergencyContact.phone} •{' '}
                            {currentBooking.emergencyContact.relation}
                        </Text>
                    </View>
                )}

                {/* Payment Info */}
                <View className="bg-white rounded-2xl mx-4 mt-4 p-4">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-800 font-semibold text-lg">Payment</Text>
                        <Badge
                            text={currentBooking.paymentStatus.toUpperCase()}
                            variant={
                                currentBooking.paymentStatus === 'paid'
                                    ? 'success'
                                    : currentBooking.paymentStatus === 'pending'
                                        ? 'warning'
                                        : 'error'
                            }
                        />
                    </View>

                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Monthly Rent</Text>
                        <Text className="text-gray-800">
                            ৳{mess?.payPerMonth?.toLocaleString()}
                        </Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Advance Months</Text>
                        <Text className="text-gray-800">× {currentBooking.advanceMonths}</Text>
                    </View>
                    <View className="h-px bg-gray-200 my-3" />
                    <View className="flex-row justify-between">
                        <Text className="text-gray-800 font-bold text-lg">Total</Text>
                        <Text className="text-primary-600 font-bold text-lg">
                            ৳{currentBooking.totalAmount?.toLocaleString()}
                        </Text>
                    </View>

                    {currentBooking.transactionId && (
                        <View className="mt-4 pt-4 border-t border-gray-100">
                            <Text className="text-gray-500 text-sm">Transaction ID</Text>
                            <Text className="text-gray-800 font-mono">
                                {currentBooking.transactionId}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Owner Info */}
                {owner && (
                    <View className="bg-white rounded-2xl mx-4 mt-4 p-4 mb-4">
                        <Text className="text-gray-800 font-semibold text-lg mb-4">
                            Mess Owner
                        </Text>
                        <View className="flex-row items-center">
                            <Avatar name={owner.name} size="lg" />
                            <View className="flex-1 ml-3">
                                <Text className="text-gray-800 font-semibold">{owner.name}</Text>
                                <Text className="text-gray-500 text-sm">{owner.phone}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => Linking.openURL(`tel:${owner.phone}`)}
                                className="w-12 h-12 bg-primary-500 rounded-full items-center justify-center"
                            >
                                <Phone size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Cancel Button */}
                {canCancel && (
                    <View className="px-4 mb-6">
                        <Button
                            title="Cancel Booking"
                            onPress={handleCancel}
                            variant="outline"
                            fullWidth
                        />
                    </View>
                )}

                <View className="h-6" />
            </ScrollView>
        </>
    );
}
