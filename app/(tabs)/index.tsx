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
import Toast from 'react-native-toast-message';
import { MessCard, Loading, Footer } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchMesses } from '../../store/slices/messSlice';
import { fetchSavedMesses, saveMess, removeSavedMess } from '../../store/slices/favoriteSlice';
import messService from '../../services/messService';
import { Colors } from '../../constants';
import { Mess, HomeSlider } from '../../types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { messes, isLoading } = useAppSelector((state) => state.mess);
    const savedMesses = useAppSelector((state) => state.favorites?.savedMesses ?? []);

    const [refreshing, setRefreshing] = useState(false);
    const [sliders, setSliders] = useState<HomeSlider[]>([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        dispatch(fetchMesses({ page: 1, limit: 10 }));
        dispatch(fetchSavedMesses());
        try {
            console.log('========================================');
            console.log('🔍 Fetching home sliders...');
            console.log('API Endpoint: /admin/get-home-page-slider');

            const response = await messService.getHomeSliders();

            console.log('📦 Full API Response:', JSON.stringify(response, null, 2));
            console.log('✅ Response Success:', response.success);
            console.log('📊 Response Data Type:', typeof response.data);
            console.log('📊 Is Array?:', Array.isArray(response.data));

            if (response.success) {
                console.log('✅ SUCCESS: Slider API returned success=true');
                console.log('📋 Data received:', response.data);
                console.log('📋 Number of sliders:', response.data?.length || 0);

                if (response.data && response.data.length > 0) {
                    console.log('🎯 First slider structure:', JSON.stringify(response.data[0], null, 2));
                    console.log('🖼️ First slider has backgroundImage?:', !!response.data[0]?.backgroundImage);
                    console.log('🖼️ backgroundImage URL:', response.data[0]?.backgroundImage?.url);
                }

                setSliders(response.data);
            } else {
                console.log('❌ ERROR: Slider API returned success=false');
                console.log('❌ Message:', response.message);
            }
            console.log('========================================');
        } catch (err) {
            console.log('========================================');
            console.error('💥 CATCH ERROR: Failed to load sliders');
            console.error('Error details:', JSON.stringify(err, null, 2));
            console.log('========================================');
        }
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
        <SafeAreaView className="flex-1 bg-gray-200 dark:bg-black" edges={['top']}>
            <ScrollView
                className="flex-1"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="bg-white dark:bg-gray-900 px-5 pt-4 pb-5 rounded-3xl mx-3">
                    <View className="flex-row justify-between items-center mb-4">
                        <View>
                            <Text className="text-gray-500 dark:text-gray-400 text-sm">{getGreeting()}</Text>
                            <Text className="text-green-500 text-xl font-bold">{user?.name || 'Guest'}</Text>
                        </View>
                        <TouchableOpacity className="w-11 h-11 bg-green-100 dark:bg-green-900 rounded-full items-center justify-center">
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
                    <View className="flex-1 bg-primary-50 dark:bg-primary-900 rounded-2xl p-4">
                        <Text className="text-primary-600 dark:text-primary-300 text-2xl font-bold">
                            {messes.filter((m) => m.status === 'free').length}+
                        </Text>
                        <Text className="text-primary-700 dark:text-primary-200 text-sm">Available Messes</Text>
                    </View>
                    <View className="flex-1 bg-secondary-50 dark:bg-secondary-900 rounded-2xl p-4">
                        <Text className="text-secondary-600 dark:text-secondary-300 text-2xl font-bold">{messes.length}+</Text>
                        <Text className="text-secondary-700 dark:text-secondary-200 text-sm">Total Listings</Text>
                    </View>
                </View>

                {/* Featured Messes */}
                <View className="mt-6 px-4">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-800 dark:text-white text-lg font-bold">Featured Messes</Text>
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
                        <View className="bg-white dark:bg-gray-900 rounded-2xl p-8 items-center">
                            <MapPin size={48} color={Colors.gray[300]} />
                            <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center">
                                No messes available at the moment
                            </Text>
                        </View>
                    ) : (
                        messes.slice(0, 5).map((mess) => (
                            <MessCard
                                key={mess._id}
                                mess={mess}
                                onPress={() => router.push(`/mess/${mess._id}`)}
                                onFavoritePress={user ? () => handleFavoriteToggle(mess._id) : undefined}
                                isFavorite={isFavorite(mess._id)}
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
