import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    MapPin,
    Phone,
    Mail,
    Heart,
    Share2,
    Calendar,
    Users,
    Star,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    Eye,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Button, Loading, Rating, Badge, Avatar } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchMessById } from '../../store/slices/messSlice';
import { saveMess, removeSavedMess } from '../../store/slices/favoriteSlice';
import messService from '../../services/messService';
import { Colors, FacilityIcons } from '../../constants';
import { Review } from '../../types';

const { width } = Dimensions.get('window');

export default function MessDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { currentMess, isLoading } = useAppSelector((state) => state.mess);
    const { savedMesses } = useAppSelector((state) => state.favorites);
    const { isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth);

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isSaved, setIsSaved] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        // Wait for auth check to complete
        if (authLoading) return;

        // Check authentication before making API calls
        if (!isAuthenticated) {
            console.log('🔒 User not authenticated, redirecting to login...');
            // The redirect is handled by _layout.tsx, but we don't make API calls
            return;
        }

        if (id) {
            console.log('🔍 Fetching mess details for ID:', id);
            setLoadError(null);
            dispatch(fetchMessById(id))
                .unwrap()
                .then((data) => {
                    console.log('✅ Mess details loaded successfully:', data?.title);
                })
                .catch((error) => {
                    console.error('❌ Failed to load mess details:', error);
                    setLoadError(error || 'Failed to load mess details');
                });
            loadReviews();
        }
    }, [id, isAuthenticated, authLoading]);

    useEffect(() => {
        setIsSaved(savedMesses.some((item) => item.mess_id._id === id));
    }, [savedMesses, id]);

    const loadReviews = async () => {
        try {
            console.log('🔍 Fetching reviews for mess:', id);
            const response = await messService.getMessReviews(id!);
            if (response.success) {
                console.log('✅ Reviews loaded:', response.data?.length || 0);
                setReviews(response.data);
            }
        } catch (err) {
            console.log('❌ Failed to load reviews:', err);
        }
    };

    const handleFavoriteToggle = () => {
        if (isSaved) {
            dispatch(removeSavedMess(id!));
            Toast.show({ type: 'info', text1: 'Removed from favorites' });
        } else {
            dispatch(saveMess(id!));
            Toast.show({ type: 'success', text1: 'Added to favorites' });
        }
    };

    const handleCall = () => {
        if (currentMess?.contact) {
            Linking.openURL(`tel:${currentMess.contact}`);
        }
    };

    const handleBook = () => {
        if (currentMess?.status !== 'free') {
            Toast.show({
                type: 'error',
                text1: 'Not Available',
                text2: 'This mess is currently not available for booking',
            });
            return;
        }
        router.push({
            pathname: '/booking/create',
            params: { messId: id },
        });
    };

    // Wait for auth check to complete
    if (authLoading) {
        return <Loading fullScreen text="Checking authentication..." />;
    }

    // If not authenticated, show loading while redirect happens
    if (!isAuthenticated) {
        return <Loading fullScreen text="Redirecting to login..." />;
    }

    if (loadError) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
                <Text className="text-xl font-bold text-gray-800 mb-2">Failed to Load</Text>
                <Text className="text-gray-500 text-center mb-6">{loadError}</Text>
                <TouchableOpacity
                    onPress={() => {
                        setLoadError(null);
                        dispatch(fetchMessById(id!));
                    }}
                    className="bg-primary-500 px-6 py-3 rounded-xl"
                >
                    <Text className="text-white font-semibold">Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mt-4"
                >
                    <Text className="text-gray-500">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    if (isLoading || !currentMess) {
        return <Loading fullScreen text="Loading mess details..." />;
    }

    const owner = typeof currentMess.owner_id === 'object' ? currentMess.owner_id : null;

    return (
        <>
            <Stack.Screen
                options={{
                    headerTransparent: true,
                    headerTitle: '',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-white/90 rounded-full items-center justify-center ml-2"
                        >
                            <ChevronLeft size={24} color={Colors.gray[800]} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <View className="flex-row gap-2 mr-2">
                            <TouchableOpacity
                                onPress={handleFavoriteToggle}
                                className="w-10 h-10 bg-white/90 rounded-full items-center justify-center"
                            >
                                <Heart
                                    size={20}
                                    color={isSaved ? Colors.error : Colors.gray[800]}
                                    fill={isSaved ? Colors.error : 'transparent'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-10 h-10 bg-white/90 rounded-full items-center justify-center">
                                <Share2 size={20} color={Colors.gray[800]} />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />

            <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
                {/* Image Gallery */}
                <View className="relative">
                    <FlatList
                        data={currentMess.image}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / width);
                            setActiveImageIndex(index);
                        }}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item.url }}
                                style={{ width, height: 300 }}
                                resizeMode="cover"
                            />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-1.5">
                        {currentMess.image.map((_, index) => (
                            <View
                                key={index}
                                className={`h-2 rounded-full ${index === activeImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
                                    }`}
                            />
                        ))}
                    </View>
                    <View className="absolute bottom-4 right-4 flex-row items-center bg-black/50 px-3 py-1.5 rounded-full">
                        <Eye size={14} color="#fff" />
                        <Text className="text-white text-sm ml-1.5">{currentMess.view} views</Text>
                    </View>
                </View>

                <View className="px-5 py-5">
                    {/* Title & Status */}
                    <View className="flex-row justify-between items-start mb-3">
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-gray-800">{currentMess.title}</Text>
                            <View className="flex-row items-center mt-1">
                                <MapPin size={14} color={Colors.gray[500]} />
                                <Text className="text-gray-500 ml-1 flex-1">{currentMess.address}</Text>
                            </View>
                        </View>
                        <Badge
                            text={currentMess.status === 'free' ? 'Available' : 'Booked'}
                            variant={currentMess.status === 'free' ? 'success' : 'error'}
                        />
                    </View>

                    {/* Price & Rating */}
                    <View className="flex-row items-center justify-between bg-gray-50 rounded-2xl p-4 mb-5">
                        <View>
                            <Text className="text-gray-500 text-sm">Monthly Rent</Text>
                            <Text className="text-primary-600 text-2xl font-bold">
                                ৳{currentMess.payPerMonth?.toLocaleString()}
                            </Text>
                            <Text className="text-gray-400 text-xs">
                                + {currentMess.advancePaymentMonth} month advance
                            </Text>
                        </View>
                        <View className="items-end">
                            <Rating
                                rating={currentMess.ratingInfo?.detailedRating || 0}
                                reviewCount={currentMess.ratingInfo?.totalReviews}
                                size="lg"
                            />
                        </View>
                    </View>

                    {/* Quick Info */}
                    <View className="flex-row mb-5 gap-3">
                        <View className="flex-1 bg-blue-50 rounded-xl p-3 items-center">
                            <Users size={20} color={Colors.secondary[500]} />
                            <Text className="text-gray-700 font-medium mt-1">{currentMess.roomType}</Text>
                            <Text className="text-gray-500 text-xs">Room Type</Text>
                        </View>
                        <View className="flex-1 bg-purple-50 rounded-xl p-3 items-center">
                            <Users size={20} color="#8b5cf6" />
                            <Text className="text-gray-700 font-medium mt-1">{currentMess.genderPreference}</Text>
                            <Text className="text-gray-500 text-xs">Preference</Text>
                        </View>
                        <View className="flex-1 bg-amber-50 rounded-xl p-3 items-center">
                            <Calendar size={20} color={Colors.accent[500]} />
                            <Text className="text-gray-700 font-medium mt-1">
                                {currentMess.availableFrom
                                    ? new Date(currentMess.availableFrom).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                    })
                                    : 'Now'}
                            </Text>
                            <Text className="text-gray-500 text-xs">Available</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View className="mb-5">
                        <Text className="text-gray-800 font-semibold text-lg mb-2">Description</Text>
                        <Text className="text-gray-600 leading-6">{currentMess.description}</Text>
                    </View>

                    {/* Facilities */}
                    <View className="mb-5">
                        <Text className="text-gray-800 font-semibold text-lg mb-3">Facilities</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {currentMess.facilities?.map((facility, index) => (
                                <View
                                    key={index}
                                    className="flex-row items-center bg-primary-50 px-3 py-2 rounded-lg"
                                >
                                    <Text className="text-primary-700">{facility}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Room Features */}
                    {currentMess.roomFeatures?.length > 0 && (
                        <View className="mb-5">
                            <Text className="text-gray-800 font-semibold text-lg mb-3">Room Features</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {currentMess.roomFeatures.map((feature, index) => (
                                    <View
                                        key={index}
                                        className="bg-gray-100 px-3 py-2 rounded-lg"
                                    >
                                        <Text className="text-gray-700">{feature}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Owner Info */}
                    {owner && (
                        <View className="bg-gray-50 rounded-2xl p-4 mb-5">
                            <Text className="text-gray-800 font-semibold text-lg mb-3">Owner</Text>
                            <View className="flex-row items-center">
                                <Avatar name={owner.name} size="lg" />
                                <View className="flex-1 ml-3">
                                    <Text className="text-gray-800 font-semibold">{owner.name}</Text>
                                    <Text className="text-gray-500 text-sm">{owner.email}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={handleCall}
                                    className="w-12 h-12 bg-primary-500 rounded-full items-center justify-center"
                                >
                                    <Phone size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Reviews Preview */}
                    <View className="mb-5">
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-gray-800 font-semibold text-lg">
                                Reviews ({reviews.length})
                            </Text>
                            {reviews.length > 0 && (
                                <TouchableOpacity>
                                    <Text className="text-primary-600 font-medium">See All</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {reviews.length > 0 ? (
                            reviews.slice(0, 2).map((review) => (
                                <View key={review._id} className="bg-gray-50 rounded-xl p-4 mb-2">
                                    <View className="flex-row items-center mb-2">
                                        <Avatar
                                            name={typeof review.user_id === 'object' ? review.user_id.name : 'User'}
                                            size="sm"
                                        />
                                        <View className="flex-1 ml-2">
                                            <Text className="text-gray-800 font-medium">
                                                {typeof review.user_id === 'object' ? review.user_id.name : 'User'}
                                            </Text>
                                        </View>
                                        <Rating rating={review.rating} size="sm" showValue={false} />
                                    </View>
                                    <Text className="text-gray-600 text-sm">{review.comment}</Text>
                                </View>
                            ))
                        ) : (
                            <View className="bg-gray-50 rounded-xl p-6 items-center">
                                <MessageCircle size={32} color={Colors.gray[300]} />
                                <Text className="text-gray-500 mt-2">No reviews yet</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Bottom Padding for Button */}
                <View className="h-24" />
            </ScrollView>

            {/* Bottom Action Bar */}
            <SafeAreaView
                edges={['bottom']}
                className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4"
            >
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity
                        onPress={handleCall}
                        className="w-14 h-14 bg-gray-100 rounded-xl items-center justify-center"
                    >
                        <Phone size={24} color={Colors.primary[500]} />
                    </TouchableOpacity>
                    <Button
                        title={currentMess.status === 'free' ? 'Book Now' : 'Not Available'}
                        onPress={handleBook}
                        disabled={currentMess.status !== 'free'}
                        fullWidth
                        size="lg"
                        className="flex-1"
                    />
                </View>
            </SafeAreaView>
        </>
    );
}
