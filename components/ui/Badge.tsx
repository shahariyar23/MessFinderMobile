import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
    text: string;
    variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
    size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
    text,
    variant = 'default',
    size = 'md',
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'success':
                return 'bg-green-100';
            case 'warning':
                return 'bg-yellow-100';
            case 'error':
                return 'bg-red-100';
            case 'info':
                return 'bg-blue-100';
            default:
                return 'bg-gray-100';
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'success':
                return 'text-green-700';
            case 'warning':
                return 'text-yellow-700';
            case 'error':
                return 'text-red-700';
            case 'info':
                return 'text-blue-700';
            default:
                return 'text-gray-700';
        }
    };

    return (
        <View className={`${getVariantStyles()} ${size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1'} rounded-full`}>
            <Text className={`${getTextColor()} ${size === 'sm' ? 'text-xs' : 'text-sm'} font-medium`}>
                {text}
            </Text>
        </View>
    );
};

export default Badge;
