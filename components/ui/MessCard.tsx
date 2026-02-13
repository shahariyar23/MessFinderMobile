import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MapPin, Star, Heart, Eye } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Mess } from '../../types';
import { Colors, BookingStatusColors } from '../../constants';
import Rating from './Rating';

interface MessCardProps {
    mess: Mess;
    onPress: () => void;
    onFavoritePress?: () => void;
    isFavorite?: boolean;
    compact?: boolean;
    className?: string;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export const MessCard: React.FC<MessCardProps> = ({
    mess,
    onPress,
    onFavoritePress,
    isFavorite = false,
    compact = false,
    className,
}) => {
    const { colorScheme } = useColorScheme();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'free':
                return 'bg-green-500';
            case 'booked':
                return 'bg-red-500';
            case 'pending':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'free':
                return 'Available';
            case 'booked':
                return 'Booked';
            case 'pending':
                return 'Pending';
            default:
                return status;
        }
    };

    if (compact) {
        return (
            <TouchableOpacity
                onPress={onPress}
                className={`${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm overflow-hidden ${className || ''}`}
                style={{ width: cardWidth }}
                activeOpacity={0.9}
            >
                <View className="relative">
                    <Image
                        source={{ uri: mess.image?.[0]?.url || 'https://via.placeholder.com/200' }}
                        className="w-full h-32"
                        resizeMode="cover"
                    />
                    {mess.status && (
                        <View className={`absolute top-2 left-2 px-2 py-1 rounded-full ${getStatusColor(mess.status)}`}>
                            <Text className="text-white text-xs font-medium">{getStatusText(mess.status)}</Text>
                        </View>
                    )}
                    {onFavoritePress && (
                        <TouchableOpacity
                            onPress={onFavoritePress}
                            className={`absolute top-2 right-2 w-8 h-8 ${colorScheme === 'dark' ? 'bg-black/50' : 'bg-white/80'} rounded-full items-center justify-center`}
                        >
                            <Heart
                                size={16}
                                color={isFavorite ? Colors.error : Colors.gray[600]}
                                fill={isFavorite ? Colors.error : 'transparent'}
                            />
                        </TouchableOpacity>
                    )
                    }
                </View >
                <View className="p-3">
                    <Text className={`${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'} font-semibold text-sm`} numberOfLines={1}>
                        {mess.title}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <MapPin size={12} color={Colors.gray[500]} />
                        <Text className={`${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs ml-1`} numberOfLines={1}>
                            {mess.address}
                        </Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-2">
                        <Text className="text-primary-600 font-bold text-sm">
                            ৳{mess.payPerMonth?.toLocaleString()}/mo
                        </Text>
                        {(mess.ratingInfo?.individualMessStats?.averageRating || mess.ratingInfo?.ownerWideStats?.averageRating) && (
                            <View className="flex-row items-center">
                                <Star size={12} color={Colors.accent[500]} fill={Colors.accent[500]} />
                                <Text className={`${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-xs ml-1`}>
                                    {(<Rating
                                        rating={mess.ratingInfo?.individualMessStats?.averageRating || mess.ratingInfo?.ownerWideStats?.averageRating || 0}
                                        reviewCount={mess.ratingInfo?.individualMessStats?.totalReviews || mess.ratingInfo?.ownerWideStats?.totalReviews}
                                        size="lg"
                                    />)}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity >
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm overflow-hidden mb-4 ${className || ''}`}
            activeOpacity={0.9}
        >
            <View className="relative">
                <Image
                    source={{ uri: mess.image?.[0]?.url || 'https://via.placeholder.com/400' }}
                    className="w-full h-48"
                    resizeMode="cover"
                />
                {mess.status && (
                    <View className={`absolute top-3 left-3 px-3 py-1.5 rounded-full ${getStatusColor(mess.status)}`}>
                        <Text className="text-white text-xs font-semibold">{getStatusText(mess.status)}</Text>
                    </View>
                )}
                {onFavoritePress && (
                    <TouchableOpacity
                        onPress={onFavoritePress}
                        className={`absolute top-3 right-3 w-10 h-10 ${colorScheme === 'dark' ? 'bg-black/50' : 'bg-white/90'} rounded-full items-center justify-center shadow-sm`}
                    >
                        <Heart
                            size={20}
                            color={isFavorite ? Colors.error : Colors.gray[600]}
                            fill={isFavorite ? Colors.error : 'transparent'}
                        />
                    </TouchableOpacity>
                )}
                <View className="absolute bottom-3 right-3 flex-row items-center bg-black/50 px-2 py-1 rounded-full">
                    <Eye size={12} color="#fff" />
                    <Text className="text-white text-xs ml-1">{mess.view || 0}</Text>
                </View>
            </View >
            <View className="p-4">
                <Text className={`${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'} font-bold text-lg`} numberOfLines={1}>
                    {mess.title}
                </Text>
                <View className="flex-row items-center mt-1">
                    <MapPin size={14} color={Colors.gray[500]} />
                    <Text className={`${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm ml-1 flex-1`} numberOfLines={1}>
                        {mess.address}
                    </Text>
                </View>

                <View className="flex-row flex-wrap mt-3 gap-2">
                    {mess.facilities?.slice(0, 3).map((facility, index) => (
                        <View key={index} className={`${colorScheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} px-2 py-1 rounded-md`}>
                            <Text className={`${colorScheme === 'dark' ? 'text-gray-200' : 'text-gray-600'} text-xs`}>{facility}</Text>
                        </View>
                    ))}
                    {mess.facilities && mess.facilities.length > 3 && (
                        <View className={`${colorScheme === 'dark' ? 'bg-primary-900/30' : 'bg-primary-50'} px-2 py-1 rounded-md`}>
                            <Text className={`${colorScheme === 'dark' ? 'text-primary-400' : 'text-primary-600'} text-xs`}>+{mess.facilities.length - 3} more</Text>
                        </View>
                    )}
                </View>

                <View className={`flex-row items-center justify-between mt-4 pt-3 border-t ${colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    <View>
                        <Text className={`${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Monthly Rent</Text>
                        <Text className={`${colorScheme === 'dark' ? 'text-primary-400' : 'text-primary-600'} font-bold text-xl`}>
                            ৳{mess.payPerMonth?.toLocaleString()}
                        </Text>
                    </View>
                    <View className={`flex-row items-center ${colorScheme === 'dark' ? 'bg-accent-900/20' : 'bg-accent-50'} px-3 py-2 rounded-xl`}>
                        <Star size={16} color={Colors.accent[500]} fill={Colors.accent[500]} />
                        <Text className={`${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'} font-semibold ml-1`}>
                            {(mess.ratingInfo?.individualMessStats?.averageRating || mess.ratingInfo?.ownerWideStats?.averageRating || 0).toFixed(1)}
                            {(mess.ratingInfo?.individualMessStats?.averageRating === 0 && mess.ratingInfo?.ownerWideStats?.averageRating > 0) && ' (Owner)'}
                        </Text>
                        <Text className={`${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs ml-1`}>
                            ({mess.ratingInfo?.individualMessStats?.totalReviews || mess.ratingInfo?.ownerWideStats?.totalReviews || 0})
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity >
    );
};

export default MessCard;
