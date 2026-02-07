import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { MessCard, Loading } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchSavedMesses, removeSavedMess } from '../../store/slices/favoriteSlice';
import { Colors } from '../../constants';
import { Mess } from '../../types';
import messService from '../../services/messService';

export default function FavoritesScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { savedMesses, isLoading } = useAppSelector((state) => state.favorites) || { savedMesses: [], isLoading: false };
    const [refreshing, setRefreshing] = useState(false);
    const [populatedMesses, setPopulatedMesses] = useState<{ _id: string; mess: Mess }[]>([]);
    const [loadingMesses, setLoadingMesses] = useState(false);

    // Fetch and populate mess details for saved messes
    const populateMessDetails = async () => {
        console.log('📋 populateMessDetails called, savedMesses:', savedMesses?.length);

        if (!savedMesses || savedMesses.length === 0) {
            console.log('⚠️ No saved messes to populate');
            setPopulatedMesses([]);
            return;
        }

        setLoadingMesses(true);
        const populated: { _id: string; mess: Mess }[] = [];

        for (const item of savedMesses) {
            console.log('🔍 Processing saved mess item:', JSON.stringify(item, null, 2));
            try {
                // Handle different API response structures (mess vs mess_id, id vs _id)
                const itemId = (item as any).id || item._id;
                const messData = (item as any).mess || item.mess_id;

                // If mess is already a populated object
                if (messData && typeof messData === 'object' && messData._id) {
                    console.log('✅ mess is already populated:', messData._id);
                    populated.push({ _id: itemId, mess: messData as Mess });
                }
                // If mess is just a string ID, fetch the full mess details
                else if (messData) {
                    const messId = typeof messData === 'string' ? messData : messData._id;
                    console.log('🔄 Fetching mess details for ID:', messId);
                    if (messId) {
                        const response = await messService.getMessById(messId);
                        console.log('📥 getMessById response:', response.success, response.data?._id);
                        if (response.success && response.data) {
                            populated.push({ _id: itemId, mess: response.data });
                        }
                    }
                } else {
                    console.log('⚠️ mess data is empty or undefined');
                }
            } catch (error) {
                console.log('❌ Failed to fetch mess details:', error);
            }
        }

        console.log('✅ Populated messes count:', populated.length);
        setPopulatedMesses(populated);
        setLoadingMesses(false);
    };

    useEffect(() => {
        console.log('🚀 FavoritesScreen mounted, fetching saved messes...');
        dispatch(fetchSavedMesses());
    }, []);

    useEffect(() => {
        console.log('📊 savedMesses changed:', savedMesses?.length, 'items');
        populateMessDetails();
    }, [savedMesses]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await dispatch(fetchSavedMesses());
        setRefreshing(false);
    }, []);

    const handleRemove = (messId: string) => {
        dispatch(removeSavedMess(messId));
    };

    if ((isLoading || loadingMesses) && populatedMesses.length === 0) {
        return <Loading fullScreen text="Loading favorites..." />;
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            {/* Header */}
            <View className="bg-white px-5 py-4 border-b border-gray-100">
                <Text className="text-2xl font-bold text-gray-800">Favorites</Text>
                <Text className="text-gray-500 mt-1">
                    {populatedMesses.length} {populatedMesses.length === 1 ? 'mess' : 'messes'} saved
                </Text>
            </View>

            <FlatList
                data={populatedMesses}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 16, flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({ item }) => (
                    <MessCard
                        mess={item.mess}
                        onPress={() => router.push(`/mess/${item.mess._id}`)}
                        onFavoritePress={() => handleRemove(item.mess._id)}
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

