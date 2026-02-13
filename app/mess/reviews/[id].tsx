import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MessageCircle } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Avatar, Rating, Loading } from '../../../components/ui';
import messService from '../../../services/messService';
import { Review } from '../../../types';
import { Colors } from '../../../constants';

export default function ReviewsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    console.log(id, 'id for reviews');
    const router = useRouter();
    const { colorScheme } = useColorScheme();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [messTitle, setMessTitle] = useState('');

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        if (!id) return;
        try {
            const response = await messService.getMessReviews(id, 1, 10);
            if (response.success) {
                setReviews(response.data.reviews);
                setMessTitle(response.data.messDetails?.title || 'Mess Reviews');
                setHasMore(response.data.pagination.hasNext);
                setPage(2);
            }
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMoreReviews = async () => {
        if (!id || isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        try {
            const response = await messService.getMessReviews(id, page, 10);
            if (response.success) {
                setReviews(prev => [...prev, ...response.data.reviews]);
                setHasMore(response.data.pagination.hasNext);
                setPage(prev => prev + 1);
            }
        } catch (error) {
            console.error('Failed to load more reviews:', error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const renderReview = ({ item }: { item: Review }) => (
        <View className={`${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl p-4 mb-3 mx-4`}>
            <View className="flex-row items-center mb-2">
                <Avatar
                    name={
                        typeof (item.user || item.user_id) === 'object'
                            ? ((item.user || item.user_id) as any).name
                            : 'User'
                    }
                    size="sm"
                />
                <View className="flex-1 ml-2">
                    <Text className={`${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'} font-medium`}>
                        {
                            typeof (item.user || item.user_id) === 'object'
                                ? ((item.user || item.user_id) as any).name
                                : 'User'
                        }
                    </Text>
                    <Text className={`${colorScheme === 'dark' ? 'text-gray-500' : 'text-gray-400'} text-xs`}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>
                <Rating rating={item.rating} size="sm" showValue={false} />
            </View>
            <Text className={`${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                {item.comment}
            </Text>
        </View>
    );

    if (isLoading) {
        return <Loading fullScreen />;
    }

    return (
        <SafeAreaView className={`flex-1 ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800"
                >
                    <ChevronLeft size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                </TouchableOpacity>
                <View className="flex-1 ml-2">
                    <Text className={`text-lg font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Reviews
                    </Text>
                    <Text className={`text-xs ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {messTitle}
                    </Text>
                </View>
            </View>

            <FlatList
                data={reviews}
                renderItem={renderReview}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ paddingVertical: 16 }}
                onEndReached={loadMoreReviews}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    <View className="items-center justify-center py-10 px-4">
                        <MessageCircle size={48} color={Colors.gray[300]} />
                        <Text className={`${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-4 text-center`}>
                            No reviews yet for this mess.
                        </Text>
                    </View>
                }
                ListFooterComponent={
                    isLoadingMore ? (
                        <View className="py-4">
                            <ActivityIndicator color={Colors.primary[500]} />
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}
