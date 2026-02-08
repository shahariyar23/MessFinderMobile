import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    fullWidth = false,
    className = '',
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return 'bg-primary-500 active:bg-primary-600';
            case 'secondary':
                return 'bg-secondary-500 active:bg-secondary-600';
            case 'outline':
                return 'bg-transparent border-2 border-primary-500 dark:border-primary-400';
            case 'ghost':
                return 'bg-transparent';
            default:
                return 'bg-primary-500';
        }
    };

    const getTextStyles = () => {
        switch (variant) {
            case 'primary':
            case 'secondary':
                return 'text-white';
            case 'outline':
            case 'ghost':
                return 'text-primary-500 dark:text-primary-400';
            default:
                return 'text-white';
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return 'py-2 px-4';
            case 'md':
                return 'py-3 px-6';
            case 'lg':
                return 'py-4 px-8';
            default:
                return 'py-3 px-6';
        }
    };

    const getTextSize = () => {
        switch (size) {
            case 'sm':
                return 'text-sm';
            case 'md':
                return 'text-base';
            case 'lg':
                return 'text-lg';
            default:
                return 'text-base';
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            className={`
        rounded-xl flex-row items-center justify-center
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50' : ''}
        ${className}
      `}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'ghost' ? '#10b981' : '#ffffff'}
                    size="small"
                />
            ) : (
                <>
                    {icon && <View className="mr-2">{icon}</View>}
                    <Text className={`font-semibold ${getTextStyles()} ${getTextSize()}`}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

export default Button;
