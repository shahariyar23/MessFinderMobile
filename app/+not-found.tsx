import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileQuestion } from 'lucide-react-native';
import { Colors } from '../constants';

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: '404 - Not Found' }} />
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 justify-center items-center px-6">
                    <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
                        <FileQuestion size={56} color={Colors.gray[400]} />
                    </View>

                    <Text className="text-3xl font-bold text-gray-800 mb-3">Page Not Found</Text>
                    <Text className="text-gray-500 text-center mb-8">
                        Sorry, we couldn't find the page you're looking for.
                    </Text>

                    <Link href="/" className="bg-primary-600 px-6 py-3 rounded-xl">
                        <Text className="text-white font-semibold">Go to Home</Text>
                    </Link>
                </View>
            </SafeAreaView>
        </>
    );
}
