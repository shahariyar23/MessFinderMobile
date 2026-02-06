import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, X } from 'lucide-react-native';
import { Colors, BookingStatusColors } from '../../constants';
import { Loading, Badge } from '../../components/ui';
import { Booking } from '../../types';

export default function AdminBookingDashboard() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>(
        'all'
    );

    useEffect(() => {
        loadBookings();
    }, [filterStatus]);

    const loadBookings = async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await adminService.getAllBookings(filterStatus);
            setBookings([]);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadBookings();
        setRefreshing(false);
    };

    const getStatusVariant = (status: string): any => {
        switch (status) {
            case 'confirmed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
            case 'rejected':
                return 'error';
            default:
                return 'primary';
        }
    };

    const renderBookingCard = ({ item }: { item: Booking }) => {
        const messTitle = typeof item.mess_id === 'string' ? item.mess_id : item.mess_id.title;
        const userName = typeof item.user_id === 'string' ? item.user_id : item.user_id.name;

        return (
            <TouchableOpacity
                onPress={() => {
                    setSelectedBooking(item);
                    setShowDetailModal(true);
                }}
                className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
            >
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1 mr-3">
                        <Text className="text-base font-bold text-gray-800" numberOfLines={1}>
                            {messTitle}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">{userName}</Text>
                    </View>
                    <Badge text={item.bookingStatus} variant={getStatusVariant(item.bookingStatus)} />
                </View>

                <View className="flex-row justify-between items-center">
                    <View>
                        <Text className="text-xl font-bold text-primary-600">৳{item.totalAmount}</Text>
                        <Text className="text-xs text-gray-400 mt-1">
                            Check-in: {new Date(item.checkInDate).toLocaleDateString()}
                        </Text>
                    </View>
                    <Badge text={item.paymentStatus} variant={getStatusVariant(item.paymentStatus)} />
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return <Loading fullScreen text="Loading bookings..." />;
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
            {/* Filter Tabs */}
            <View className="bg-white px-4 py-3 shadow-sm">
                <View className="flex-row gap-2">
                    {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
                        <TouchableOpacity
                            key={status}
                            onPress={() => setFilterStatus(status as any)}
                            className={`px-4 py-2 rounded-full ${filterStatus === status ? 'bg-primary-500' : 'bg-gray-100'
                                }`}
                        >
                            <Text
                                className={
                                    filterStatus === status ? 'text-white font-medium' : 'text-gray-600'
                                }
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Booking List */}
            <FlatList
                data={bookings}
                keyExtractor={(item) => item._id}
                renderItem={renderBookingCard}
                contentContainerStyle={{ padding: 16 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={() => (
                    <View className="items-center py-12">
                        <Calendar size={64} color={Colors.gray[300]} />
                        <Text className="text-gray-500 mt-4 text-center">No bookings found</Text>
                    </View>
                )}
            />

            {/* Detail Modal */}
            <Modal visible={showDetailModal} animationType="slide" transparent>
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-800">Booking Details</Text>
                            <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                                <X size={24} color={Colors.gray[600]} />
                            </TouchableOpacity>
                        </View>

                        {selectedBooking && (
                            <View>
                                <View className="space-y-4">
                                    <View>
                                        <Text className="text-sm font-medium text-gray-500">Mess</Text>
                                        <Text className="text-gray-800 mt-1">
                                            {typeof selectedBooking.mess_id === 'string'
                                                ? selectedBooking.mess_id
                                                : selectedBooking.mess_id.title}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className="text-sm font-medium text-gray-500">Student</Text>
                                        <Text className="text-gray-800 mt-1">{selectedBooking.tenantName}</Text>
                                        <Text className="text-gray-500 text-sm">{selectedBooking.tenantEmail}</Text>
                                        <Text className="text-gray-500 text-sm">{selectedBooking.tenantPhone}</Text>
                                    </View>
                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-sm font-medium text-gray-500">Amount</Text>
                                            <Text className="text-xl font-bold text-primary-600 mt-1">
                                                ৳{selectedBooking.totalAmount}
                                            </Text>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-sm font-medium text-gray-500">Advance Months</Text>
                                            <Text className="text-gray-800 mt-1">
                                                {selectedBooking.advanceMonths} months
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-sm font-medium text-gray-500">Booking Status</Text>
                                            <Badge
                                                text={selectedBooking.bookingStatus}
                                                variant={getStatusVariant(selectedBooking.bookingStatus)}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-sm font-medium text-gray-500">Payment Status</Text>
                                            <Badge
                                                text={selectedBooking.paymentStatus}
                                                variant={getStatusVariant(selectedBooking.paymentStatus)}
                                            />
                                        </View>
                                    </View>
                                    <View>
                                        <Text className="text-sm font-medium text-gray-500">Check-in Date</Text>
                                        <Text className="text-gray-800 mt-1">
                                            {new Date(selectedBooking.checkInDate).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    {selectedBooking.emergencyContact && (
                                        <View>
                                            <Text className="text-sm font-medium text-gray-500">
                                                Emergency Contact
                                            </Text>
                                            <Text className="text-gray-800 mt-1">
                                                {selectedBooking.emergencyContact.name} ({selectedBooking.emergencyContact.relation})
                                            </Text>
                                            <Text className="text-gray-500 text-sm">
                                                {selectedBooking.emergencyContact.phone}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
