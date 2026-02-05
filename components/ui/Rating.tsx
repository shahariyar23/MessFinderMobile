import React from 'react';
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import { Colors } from '../../constants';

interface RatingProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
    reviewCount?: number;
}

export const Rating: React.FC<RatingProps> = ({
    rating,
    maxRating = 5,
    size = 'md',
    showValue = true,
    reviewCount,
}) => {
    const getSize = () => {
        switch (size) {
            case 'sm':
                return 14;
            case 'md':
                return 18;
            case 'lg':
                return 24;
            default:
                return 18;
        }
    };

    const starSize = getSize();

    return (
        <View className="flex-row items-center">
            {[...Array(maxRating)].map((_, index) => {
                const filled = index < Math.floor(rating);
                const partial = index === Math.floor(rating) && rating % 1 !== 0;

                return (
                    <Star
                        key={index}
                        size={starSize}
                        color={Colors.accent[500]}
                        fill={filled ? Colors.accent[500] : partial ? Colors.accent[200] : 'transparent'}
                    />
                );
            })}
            {showValue && (
                <Text className={`ml-1 text-gray-700 font-medium ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm'}`}>
                    {rating.toFixed(1)}
                </Text>
            )}
            {reviewCount !== undefined && (
                <Text className={`ml-1 text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                    ({reviewCount})
                </Text>
            )}
        </View>
    );
};

export default Rating;
