import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Sun, Moon } from 'lucide-react-native';

export default function DarkModeTest() {
    const { colorScheme, setColorScheme } = useColorScheme();

    const toggleDarkMode = () => {
        setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <View className="flex-1 items-center justify-center p-6">
                {/* Header */}
                <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Dark Mode Test
                </Text>

                {/* Current Mode Display */}
                <View className="bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-xl mb-8">
                    <Text className="text-gray-600 dark:text-gray-300 font-medium">
                        Current Mode: {colorScheme || 'light'}
                    </Text>
                </View>

                {/* Test Cards */}
                <View className="w-full space-y-4">
                    <View className="bg-blue-100 dark:bg-blue-900 p-4 rounded-xl">
                        <Text className="text-blue-900 dark:text-blue-100 font-semibold">
                            Blue Card (should change in dark mode)
                        </Text>
                    </View>

                    <View className="bg-green-100 dark:bg-green-900 p-4 rounded-xl">
                        <Text className="text-green-900 dark:text-green-100 font-semibold">
                            Green Card (should change in dark mode)
                        </Text>
                    </View>

                    <View className="bg-red-100 dark:bg-red-900 p-4 rounded-xl">
                        <Text className="text-red-900 dark:text-red-100 font-semibold">
                            Red Card (should change in dark mode)
                        </Text>
                    </View>
                </View>

                {/* Toggle Button */}
                <TouchableOpacity
                    onPress={toggleDarkMode}
                    className="mt-8 bg-primary-500 dark:bg-primary-600 px-8 py-4 rounded-xl flex-row items-center"
                >
                    {colorScheme === 'dark' ? (
                        <Sun size={24} color="#fff" />
                    ) : (
                        <Moon size={24} color="#fff" />
                    )}
                    <Text className="text-white font-bold text-lg ml-3">
                        Toggle to {colorScheme === 'dark' ? 'Light' : 'Dark'} Mode
                    </Text>
                </TouchableOpacity>

                {/* Instructions */}
                <View className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
                    <Text className="text-yellow-800 dark:text-yellow-200 text-sm text-center">
                        If colors don't change when you tap the button,
                        dark mode is NOT working correctly.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
