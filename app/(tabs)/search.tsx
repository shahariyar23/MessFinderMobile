import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Search,
    SlidersHorizontal,
    X,
    ArrowUpDown,
    MapPin,
} from 'lucide-react-native';
import { MessCard, Loading, Button } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { searchMesses, fetchMesses, setFilters } from '../../store/slices/messSlice';
import { saveMess, removeSavedMess } from '../../store/slices/favoriteSlice';
import { Colors, RoomTypes, GenderPreferences } from '../../constants';

export default function SearchScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { messes, isLoading, pagination, filters } = useAppSelector((state) => state.mess);
    const { savedMesses } = useAppSelector((state) => state.favorites);

    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        location: '',
        roomType: '',
        genderPreference: '',
        sortBy: 'createdAt' as string,
        sortOrder: 'desc' as 'asc' | 'desc',
    });

    useEffect(() => {
        loadMesses();
    }, []);

    const loadMesses = (page = 1) => {
        if (searchQuery || localFilters.location) {
            dispatch(
                searchMesses({
                    search: searchQuery,
                    location: localFilters.location,
                    sortBy: localFilters.sortBy,
                    sortOrder: localFilters.sortOrder,
                    page,
                    limit: 10,
                })
            );
        } else {
            dispatch(fetchMesses({ page, limit: 10 }));
        }
    };

    const handleSearch = () => {
        loadMesses(1);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadMesses(1);
        setRefreshing(false);
    }, [searchQuery, localFilters]);

    const applyFilters = () => {
        dispatch(setFilters(localFilters));
        setShowFilters(false);
        loadMesses(1);
    };

    const clearFilters = () => {
        setLocalFilters({
            location: '',
            roomType: '',
            genderPreference: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
        });
    };

    const isFavorite = (messId: string) => {
        return savedMesses.some((item) => item.mess_id._id === messId);
    };

    const handleFavoriteToggle = (messId: string) => {
        if (isFavorite(messId)) {
            dispatch(removeSavedMess(messId));
        } else {
            dispatch(saveMess(messId));
        }
    };

    const loadMore = () => {
        if (pagination?.hasNext && !isLoading) {
            loadMesses((pagination.currentPage || 1) + 1);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            {/* Search Header */}
            <View className="bg-white px-4 pt-4 pb-4 shadow-sm">
                <View className="flex-row items-center gap-3">
                    <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                        <Search size={20} color={Colors.gray[400]} />
                        <TextInput
                            placeholder="Search mess, location..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                            className="flex-1 ml-3 text-gray-800"
                            placeholderTextColor={Colors.gray[400]}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <X size={18} color={Colors.gray[400]} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity
                        onPress={() => setShowFilters(true)}
                        className="w-12 h-12 bg-primary-500 rounded-xl items-center justify-center"
                    >
                        <SlidersHorizontal size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Quick Filters */}
                <View className="flex-row mt-3 gap-2">
                    {['All', 'Available', 'Top Rated', 'Lowest Price'].map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => {
                                if (filter === 'Lowest Price') {
                                    setLocalFilters((prev) => ({ ...prev, sortBy: 'price', sortOrder: 'asc' }));
                                    loadMesses(1);
                                } else if (filter === 'Top Rated') {
                                    setLocalFilters((prev) => ({ ...prev, sortBy: 'rating', sortOrder: 'desc' }));
                                    loadMesses(1);
                                }
                            }}
                            className={`px-4 py-2 rounded-full ${filter === 'All' ? 'bg-primary-500' : 'bg-gray-100'
                                }`}
                        >
                            <Text className={filter === 'All' ? 'text-white font-medium' : 'text-gray-600'}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Results */}
            <FlatList
                data={messes}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 16 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListHeaderComponent={() => (
                    <Text className="text-gray-500 mb-3">
                        {messes.length} {messes.length === 1 ? 'mess' : 'messes'} found
                    </Text>
                )}
                renderItem={({ item }) => (
                    <MessCard
                        mess={item}
                        onPress={() => router.push(`/mess/${item._id}`)}
                        onFavoritePress={() => handleFavoriteToggle(item._id)}
                        isFavorite={isFavorite(item._id)}
                    />
                )}
                ListEmptyComponent={() =>
                    !isLoading ? (
                        <View className="items-center py-12">
                            <MapPin size={48} color={Colors.gray[300]} />
                            <Text className="text-gray-500 mt-4">No messes found</Text>
                            <Text className="text-gray-400 text-sm">Try adjusting your search or filters</Text>
                        </View>
                    ) : null
                }
                ListFooterComponent={() =>
                    isLoading ? <Loading text="Loading..." /> : <View className="h-4" />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
            />

            {/* Filter Modal */}
            <Modal visible={showFilters} animationType="slide" transparent>
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-800">Filters</Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)}>
                                <X size={24} color={Colors.gray[600]} />
                            </TouchableOpacity>
                        </View>

                        {/* Location */}
                        <View className="mb-5">
                            <Text className="text-gray-700 font-medium mb-2">Location</Text>
                            <TextInput
                                placeholder="Enter location"
                                value={localFilters.location}
                                onChangeText={(v) => setLocalFilters((prev) => ({ ...prev, location: v }))}
                                className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800"
                                placeholderTextColor={Colors.gray[400]}
                            />
                        </View>

                        {/* Room Type */}
                        <View className="mb-5">
                            <Text className="text-gray-700 font-medium mb-2">Room Type</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {RoomTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        onPress={() =>
                                            setLocalFilters((prev) => ({
                                                ...prev,
                                                roomType: prev.roomType === type ? '' : type,
                                            }))
                                        }
                                        className={`px-4 py-2 rounded-full border ${localFilters.roomType === type
                                                ? 'bg-primary-500 border-primary-500'
                                                : 'border-gray-300'
                                            }`}
                                    >
                                        <Text
                                            className={
                                                localFilters.roomType === type ? 'text-white' : 'text-gray-600'
                                            }
                                        >
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Gender Preference */}
                        <View className="mb-5">
                            <Text className="text-gray-700 font-medium mb-2">Gender Preference</Text>
                            <View className="flex-row gap-2">
                                {GenderPreferences.map((pref) => (
                                    <TouchableOpacity
                                        key={pref}
                                        onPress={() =>
                                            setLocalFilters((prev) => ({
                                                ...prev,
                                                genderPreference: prev.genderPreference === pref ? '' : pref,
                                            }))
                                        }
                                        className={`flex-1 py-3 rounded-xl border items-center ${localFilters.genderPreference === pref
                                                ? 'bg-primary-500 border-primary-500'
                                                : 'border-gray-300'
                                            }`}
                                    >
                                        <Text
                                            className={
                                                localFilters.genderPreference === pref ? 'text-white font-medium' : 'text-gray-600'
                                            }
                                        >
                                            {pref}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Sort */}
                        <View className="mb-6">
                            <Text className="text-gray-700 font-medium mb-2">Sort By</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {[
                                    { label: 'Latest', value: 'createdAt' },
                                    { label: 'Price', value: 'price' },
                                    { label: 'Rating', value: 'rating' },
                                    { label: 'Views', value: 'views' },
                                ].map((item) => (
                                    <TouchableOpacity
                                        key={item.value}
                                        onPress={() =>
                                            setLocalFilters((prev) => ({
                                                ...prev,
                                                sortBy: item.value,
                                            }))
                                        }
                                        className={`px-4 py-2 rounded-full border ${localFilters.sortBy === item.value
                                                ? 'bg-secondary-500 border-secondary-500'
                                                : 'border-gray-300'
                                            }`}
                                    >
                                        <Text
                                            className={
                                                localFilters.sortBy === item.value ? 'text-white' : 'text-gray-600'
                                            }
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Actions */}
                        <View className="flex-row gap-3">
                            <Button
                                title="Clear"
                                onPress={clearFilters}
                                variant="outline"
                                className="flex-1"
                            />
                            <Button
                                title="Apply Filters"
                                onPress={applyFilters}
                                className="flex-1"
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
