import React, { useEffect, useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react-native';
import { Loading, Badge } from '../../components/ui';
import { useColorScheme } from 'nativewind';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchUserBookings } from '../../store/slices/bookingSlice';
import { Colors, BookingStatusColors, PaymentStatusColors } from '../../constants';
import { Booking, Mess } from '../../types';

type TabType = 'upcoming' | 'past';

export default function BookingsScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { bookings, isLoading, counts } = useAppSelector((state) => state.booking);
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');
    const [refreshing, setRefreshing] = useState(false);
    const { colorScheme } = useColorScheme();

    useEffect(() => {
        loadBookings();
    }, [activeTab]);

    const loadBookings = () => {
        dispatch(fetchUserBookings({ page: 1, limit: 20, type: activeTab }));
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await dispatch(fetchUserBookings({ page: 1, limit: 20, type: activeTab }));
        setRefreshing(false);
    }, [activeTab]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
        switch (status) {
            case 'confirmed':
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
            case 'rejected':
                return 'error';
            default:
                return 'default';
        }
    };

    const renderBookingCard = ({ item }: { item: Booking }) => {
        const mess = item.mess_id as Mess;

        return (
            <TouchableOpacity
                onPress={() => router.push(`/booking/${item._id}`)}
                className={`${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl mb-4 overflow-hidden shadow-sm`}
                activeOpacity={0.9}
            >
                <View className="flex-row">
                    <Image
                        source={{ uri: mess?.image?.[0]?.url || 'https://via.placeholder.com/100' }}
                        className="w-24 h-full"
                        resizeMode="cover"
                    />
                    <View className="flex-1 p-4">
                        <View className="flex-row justify-between items-start mb-2">
                            <Text className={`${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'} font-semibold flex-1 mr-2`} numberOfLines={1}>
                                {mess?.title || 'Mess'}
                            </Text>
                            <Badge
                                text={item.bookingStatus.charAt(0).toUpperCase() + item.bookingStatus.slice(1)}
                                variant={getStatusVariant(item.bookingStatus)}
                                size="sm"
                            />
                        </View>

                        <View className="flex-row items-center mb-1">
                            <MapPin size={12} color={Colors.gray[500]} />
                            <Text className={`${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs ml-1`} numberOfLines={1}>
                                {mess?.address || 'Address'}
                            </Text>
                        </View>

                        <View className="flex-row items-center mb-2">
                            <Calendar size={12} color={Colors.gray[500]} />
                            <Text className={`${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs ml-1`}>
                                Check-in: {formatDate(item.checkInDate)}
                            </Text>
                        </View>

                        <View className={`flex-row justify-between items-center pt-2 border-t ${colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                            <View>
                                <Text className={`${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Total Amount</Text>
                                <Text className={`${colorScheme === 'dark' ? 'text-primary-400' : 'text-primary-600'} font-bold`}>
                                    ৳{item.totalAmount?.toLocaleString()}
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <View
                                    className={`w-2 h-2 rounded-full mr-1.5`}
                                    style={{
                                        backgroundColor:
                                            PaymentStatusColors[item.paymentStatus] || Colors.gray[400],
                                    }}
                                />

                                <Text className={`${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-xs capitalize`}>
                                    {item.paymentStatus}
                                </Text>
                                <ChevronRight size={16} color={Colors.gray[400]} />
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#000000' : '#E5E7EB' }} edges={['top']}>

            {/* Header */}
            <View className={`${colorScheme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white'} px-5 py-4 mx-4 rounded-t-3xl`}>
                <Text className={`text-2xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>My Bookings</Text>
            </View>

            {/* Tabs */}
            <View className={`${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white'} px-5 pb-4 flex-row gap-3 mx-4`}>
                <TouchableOpacity onPress={() => setActiveTab('upcoming')} className={`flex-1 py-3 rounded-xl items-center ${activeTab === 'upcoming' ? 'bg-primary-500' : (colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100')}`} >
                    <Text className={`font-medium ${activeTab === 'upcoming' ? 'text-white' : (colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600')}`} > Upcoming ({counts?.upcoming || 0}) </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('past')} className={`flex-1 py-3 rounded-xl items-center ${activeTab === 'past' ? 'bg-primary-500' : (colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100')}`} >
                    <Text className={`font-medium ${activeTab === 'past' ? 'text-white' : (colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600')}`} > Past ({counts?.past || 0}) </Text>
                </TouchableOpacity>
            </View>

            {/* Bookings List */}
            <FlatList
                data={bookings}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 16, flexGrow: 1, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                renderItem={renderBookingCard}
                ListEmptyComponent={() =>
                    !isLoading ? (
                        <View className="flex-1 items-center justify-center py-20">

                            <View className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full items-center justify-center mb-4">
                                <Calendar size={40} color={Colors.secondary[500]} />
                            </View>

                            <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                No {activeTab} bookings
                            </Text>

                            <Text className="text-center mt-2 px-8 text-gray-500 dark:text-gray-400">
                                {activeTab === "upcoming"
                                    ? "Book a mess to see your upcoming reservations here"
                                    : "Your past bookings will appear here"}
                            </Text>

                        </View>
                    ) : null
                }
                ListFooterComponent={() =>
                    isLoading ? <Loading text="Loading bookings..." /> : null
                }
            />

        </SafeAreaView>
    );
}
