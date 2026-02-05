import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { MessCard, Loading } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchSavedMesses, removeSavedMess } from '../../store/slices/favoriteSlice';
import { Colors } from '../../constants';

export default function FavoritesScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { savedMesses, isLoading } = useAppSelector((state) => state.favorites);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchSavedMesses());
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await dispatch(fetchSavedMesses());
        setRefreshing(false);
    }, []);

    const handleRemove = (messId: string) => {
        dispatch(removeSavedMess(messId));
    };

    if (isLoading && savedMesses.length === 0) {
        return <Loading fullScreen text="Loading favorites..." />;
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            {/* Header */}
            <View className="bg-white px-5 py-4 border-b border-gray-100">
                <Text className="text-2xl font-bold text-gray-800">Favorites</Text>
                <Text className="text-gray-500 mt-1">
                    {savedMesses.length} {savedMesses.length === 1 ? 'mess' : 'messes'} saved
                </Text>
            </View>

            <FlatList
                data={savedMesses}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 16, flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({ item }) => (
                    <MessCard
                        mess={item.mess_id}
                        onPress={() => router.push(`/mess/${item.mess_id._id}`)}
                        onFavoritePress={() => handleRemove(item.mess_id._id)}
                        isFavorite={true}
                    />
                )}
                ListEmptyComponent={() => (
                    <View className="flex-1 items-center justify-center py-20">
                        <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
                            <Heart size={40} color={Colors.error} />
                        </View>
                        <Text className="text-gray-800 text-lg font-semibold">No Favorites Yet</Text>
                        <Text className="text-gray-500 text-center mt-2 px-8">
                            Start exploring and save your favorite messes for quick access
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
