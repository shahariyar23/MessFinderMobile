import React from 'react';
import { View, Text, Image } from 'react-native';
import { Colors } from '../../constants';

interface AvatarProps {
    source?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar: React.FC<AvatarProps> = ({
    source,
    name,
    size = 'md',
}) => {
    const getSize = () => {
        switch (size) {
            case 'sm':
                return 'w-8 h-8';
            case 'md':
                return 'w-12 h-12';
            case 'lg':
                return 'w-16 h-16';
            case 'xl':
                return 'w-24 h-24';
            default:
                return 'w-12 h-12';
        }
    };

    const getTextSize = () => {
        switch (size) {
            case 'sm':
                return 'text-xs';
            case 'md':
                return 'text-base';
            case 'lg':
                return 'text-xl';
            case 'xl':
                return 'text-3xl';
            default:
                return 'text-base';
        }
    };

    const getInitials = (name: string) => {
        const names = name.trim().split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (source) {
        return (
            <Image
                source={{ uri: source }}
                className={`${getSize()} rounded-full`}
                resizeMode="cover"
            />
        );
    }

    return (
        <View className={`${getSize()} rounded-full bg-primary-100 items-center justify-center`}>
            <Text className={`${getTextSize()} font-semibold text-primary-600`}>
                {name ? getInitials(name) : '?'}
            </Text>
        </View>
    );
};

export default Avatar;
