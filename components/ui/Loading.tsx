import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Colors } from '../../constants';

interface LoadingProps {
    size?: 'small' | 'large';
    color?: string;
    text?: string;
    fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
    size = 'large',
    color = Colors.primary[500],
    text,
    fullScreen = false,
}) => {
    if (fullScreen) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size={size} color={color} />
                {text && <Text className="text-gray-600 mt-4 text-base">{text}</Text>}
            </View>
        );
    }

    return (
        <View className="py-8 items-center justify-center">
            <ActivityIndicator size={size} color={color} />
            {text && <Text className="text-gray-600 mt-3 text-sm">{text}</Text>}
        </View>
    );
};

export default Loading;
