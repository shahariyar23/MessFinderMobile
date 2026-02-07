import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Calendar, MessageSquare } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchUserReviews } from '../../store/slices/reviewSlice';
import { Colors } from '../../constants';
import { Mess } from '../../types';

export default function MyReviewsScreen() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { reviews, isLoading, error } = useAppSelector((state) => state.reviews);

    useEffect(() => {
        dispatch(fetchUserReviews({ page: 1, limit: 50 }));
    }, [dispatch]);

    const renderReviewItem = ({ item }: { item: any }) => {
        const mess = item.mess_id as Mess;
        const messName = typeof mess === 'object' ? mess.title : 'Unknown Mess';
        const messImage = typeof mess === 'object' && mess.image?.length > 0 ? mess.image[0].url : null;

        return (
            <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm mx-4">
                {/* Header with Mess Info */}
                <View className="flex-row items-center mb-3">
                    {messImage && (
                        <Image
                            source={{ uri: messImage }}
                            className="w-10 h-10 rounded-lg mr-3"
                        />
                    )}
                    <View className="flex-1">
                        <Text className="text-gray-800 font-bold text-base" numberOfLines={1}>
                            {messName}
                        </Text>
                        <View className="flex-row items-center mt-1">
                            <Calendar size={12} color={Colors.gray[500]} />
                            <Text className="text-gray-500 text-xs ml-1">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star size={14} color={Colors.warning} fill={Colors.warning} />
                        <Text className="text-yellow-700 font-bold ml-1">{item.rating}</Text>
                    </View>
                </View>

                {/* Review Content */}
                <View className="bg-gray-50 p-3 rounded-xl">
                    <Text className="text-gray-700 leading-5">
                        {item.comment}
                    </Text>
                </View>
            </View>
        );
    };

    if (isLoading && reviews.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <ActivityIndicator size="large" color={Colors.primary[500]} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'My Reviews',
                    headerStyle: { backgroundColor: '#F9FAFB' },
                    headerShadowVisible: false,
                    headerTintColor: Colors.gray[800],
                }}
            />

            {error ? (
                <View className="flex-1 justify-center items-center p-6">
                    <MessageSquare size={48} color={Colors.gray[300]} />
                    <Text className="text-gray-500 mt-4 text-center">{error}</Text>
                </View>
            ) : reviews.length === 0 ? (
                <View className="flex-1 justify-center items-center p-6">
                    <MessageSquare size={64} color={Colors.gray[200]} />
                    <Text className="text-gray-800 font-bold text-lg mt-4">No Reviews Yet</Text>
                    <Text className="text-gray-500 text-center mt-2">
                        You haven't written any reviews yet. Book a mess and share your experience!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={reviews}
                    renderItem={renderReviewItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}
