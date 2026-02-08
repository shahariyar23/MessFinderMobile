import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { Colors } from "../../constants";

interface InputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText?: (text: string) => void;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "number-pad";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    multiline?: boolean;
    numberOfLines?: number;
    icon?: React.ReactNode;
    editable?: boolean;
    className?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    secureTextEntry = false,
    keyboardType = "default",
    autoCapitalize = "none",
    multiline = false,
    numberOfLines = 1,
    icon,
    editable = true,
    className = "",
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className={`mb-4 ${className}`}>

            {/* Label */}
            {label && (
                <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    {label}
                </Text>
            )}

            {/* Input Wrapper */}
            <View
                className={`
          flex-row items-center rounded-xl border-2
          bg-gray-50 dark:bg-gray-800
          ${isFocused
                        ? "border-primary-500 bg-white dark:bg-gray-900"
                        : "border-gray-200 dark:border-gray-700"
                    }
          ${error ? "border-red-500" : ""}
          ${!editable ? "opacity-60" : ""}
        `}
            >

                {/* Left Icon */}
                {icon && <View className="pl-4">{icon}</View>}

                {/* Text Input */}
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={Colors.gray[500]}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry && !showPassword}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    editable={editable}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
            flex-1 py-3.5 px-4 text-base
            text-gray-900 dark:text-white
            ${multiline ? "min-h-[100px]" : ""}
          `}
                    style={{ textAlignVertical: multiline ? "top" : "center" }}
                />

                {/* Password Toggle */}
                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="pr-4"
                    >
                        {showPassword ? (
                            <EyeOff size={20} color={Colors.gray[500]} />
                        ) : (
                            <Eye size={20} color={Colors.gray[500]} />
                        )}
                    </TouchableOpacity>
                )}

            </View>

            {/* Error */}
            {error && (
                <Text className="text-red-500 text-xs mt-1">
                    {error}
                </Text>
            )}

        </View>
    );
};

export default Input;