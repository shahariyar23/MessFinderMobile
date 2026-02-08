import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell, MapPin, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import Toast from 'react-native-toast-message';
import { MessCard, Loading, Footer } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchMesses, fetchHomeSliders } from '../../store/slices/messSlice';
import { fetchSavedMesses, saveMess, removeSavedMess } from '../../store/slices/favoriteSlice';
import messService from '../../services/messService';
import { Colors } from '../../constants';
import { Mess, HomeSlider } from '../../types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { messes, homeSliders: sliders, isLoading } = useAppSelector((state) => state.mess);
    const savedMesses = useAppSelector((state) => state.favorites?.savedMesses ?? []);
    const { colorScheme } = useColorScheme();

    const [refreshing, setRefreshing] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        dispatch(fetchMesses({ page: 1, limit: 3 }));
        dispatch(fetchSavedMesses());
        dispatch(fetchHomeSliders());
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, []);

    const isFavorite = (messId: string) => {
        return savedMesses?.some((item) => {
            // Handle both cases: mess_id could be an object with _id or just a string ID
            // Also handle the case where the API returns `mess` instead of `mess_id`
            const messData = (item as any).mess || item.mess_id;
            const itemMessId = typeof messData === 'object' ? messData?._id : messData;
            return itemMessId === messId;
        }) || false;
    };

    const handleFavoriteToggle = async (messId: string) => {
        const mess = messes.find((m) => m._id === messId);
        const messName = mess?.title || 'Mess';

        if (isFavorite(messId)) {
            dispatch(removeSavedMess(messId));
            Toast.show({
                type: 'info',
                text1: 'Removing...',
                text2: `${messName} removed from favorites`,
            });
        } else {
            dispatch(saveMess(messId));
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: `${messName} added to favorites`,
            });
        }
    };

    useEffect(() => {
        if (sliders.length > 1) {
            const interval = setInterval(() => {
                const nextIndex = (activeSlide + 1) % sliders.length;
                setActiveSlide(nextIndex);
                flatListRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
            }, 3000); // Change slide every 3 seconds

            return () => clearInterval(interval);
        }
    }, [activeSlide, sliders.length]);

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) return 'Good Morning';
        if (hour >= 12 && hour < 18) return 'Good Afternoon';
        if (hour >= 18 && hour < 21) return 'Good Evening';
        return 'Good Night'; // 9 PM – 4:59 AM
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colorScheme === 'dark' ? '#000000' : '#E5E7EB'
            }}
            edges={['top']}
        >
            <ScrollView
                className="flex-1"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className={`${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white'} px-5 pt-4 pb-5 rounded-3xl mx-3`}>
                    {/* <View className="flex-1 bg-background dark:bg-gray-900"> */}
                    <View className="flex-row justify-between items-center mb-4">
                        <View>
                            <Text className={`${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{getGreeting()}</Text>
                            <Text className="text-green-500 text-xl font-bold">{user?.name || 'Guest'}</Text>
                        </View>
                        <TouchableOpacity className={`w-11 h-11 ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-green-100'} rounded-full items-center justify-center`}>
                            <Bell size={22} color={Colors.primary[500]} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Image Slider */}
                {sliders.length > 0 && (
                    <View className="my-4">
                        <FlatList
                            ref={flatListRef}
                            data={sliders}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={(e) => {
                                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                                setActiveSlide(index);
                            }}
                            renderItem={({ item }) => (
                                <Image
                                    source={{ uri: item.backgroundImage?.url || 'https://via.placeholder.com/400x160' }}
                                    style={{ width: width - 32, height: 160, marginHorizontal: 16 }}
                                    className="rounded-2xl"
                                    resizeMode="cover"
                                />
                            )}
                            keyExtractor={(item) => item._id}
                        />
                        {sliders.length > 1 && (
                            <View className="flex-row justify-center mx-3 gap-1.5">
                                {sliders.map((_, index) => (
                                    <View
                                        key={index}
                                        className={`h-2 rounded-full ${index === activeSlide ? 'w-6 bg-primary-500' : 'w-2 bg-gray-300 dark:bg-gray-700'
                                            }`}
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* Quick Stats */}
                <View className="flex-row px-4 mx-auto gap-3">
                    <View className={`flex-1 ${colorScheme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-primary-50'} rounded-2xl p-4`}>
                        <Text className={`${colorScheme === 'dark' ? 'text-primary-400' : 'text-primary-600'} text-2xl font-bold`}>
                            {messes.filter((m) => m.status === 'free').length}+
                        </Text>
                        <Text className={`${colorScheme === 'dark' ? 'text-gray-400' : 'text-primary-700'} text-sm`}>Available Messes</Text>
                    </View>
                    <View className={`flex-1 ${colorScheme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-secondary-50'} rounded-2xl p-4`}>
                        <Text className={`${colorScheme === 'dark' ? 'text-secondary-400' : 'text-secondary-600'} text-2xl font-bold`}>{messes.length}+</Text>
                        <Text className={`${colorScheme === 'dark' ? 'text-gray-400' : 'text-secondary-700'} text-sm`}>Total Listings</Text>
                    </View>
                </View>

                {/* Featured Messes */}
                <View className="mt-6 px-4">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className={`${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'} text-lg font-bold`}>Featured Messes</Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/search')}
                            className="flex-row items-center"
                        >
                            <Text className="text-primary-600 font-medium mr-1">View All</Text>
                            <ChevronRight size={16} color={Colors.primary[500]} />
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <Loading text="Loading messes..." />
                    ) : messes.length === 0 ? (
                        <View className={`${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-8 items-center`}>
                            <MapPin size={48} color={Colors.gray[300]} />
                            <Text className={`${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-4 text-center`}>
                                No messes available at the moment
                            </Text>
                        </View>
                    ) : (
                        messes.map((mess) => (
                            <MessCard
                                key={mess._id}
                                mess={mess}
                                onPress={() => router.push(`/mess/${mess._id}`)}
                                onFavoritePress={user ? () => handleFavoriteToggle(mess._id) : undefined}
                                isFavorite={isFavorite(mess._id)}
                                className="mb-6"
                            />
                        ))
                    )}
                </View>

                {/* Footer */}
                <Footer />

                {/* Bottom Padding for Tab Bar */}
            </ScrollView>
        </SafeAreaView>
    );
}
