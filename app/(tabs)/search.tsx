import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    Modal,
    ScrollView,
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
import { useColorScheme } from 'nativewind';
import Toast from 'react-native-toast-message';
import { MessCard, Loading, Button } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { searchMesses, fetchMesses, setFilters } from '../../store/slices/messSlice';
import { saveMess, removeSavedMess } from '../../store/slices/favoriteSlice';
import { Colors, RoomTypes, GenderPreferences } from '../../constants';

export default function SearchScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { messes, isLoading, pagination, filters } = useAppSelector((state) => state.mess);
    const { user } = useAppSelector((state) => state.auth);
    const savedMesses = useAppSelector((state) => state.favorites?.savedMesses ?? []);
    const { colorScheme } = useColorScheme();

    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        location: '',
        roomType: '',
        genderPreference: '',
        sortBy: 'createdAt' as 'createdAt' | 'price' | 'rating' | 'views',
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
        return savedMesses?.some((item) => {
            // Handle both cases: mess_id could be an object with _id or just a string ID
            // Also handle the case where the API returns `mess` instead of `mess_id`
            const messData = (item as any).mess || item.mess_id;
            const itemMessId = typeof messData === 'object' ? messData?._id : messData;
            return itemMessId === messId;
        }) || false;
    };

    const handleFavoriteToggle = (messId: string) => {
        const mess = messes.find((m) => m._id === messId);
        const messName = mess?.title || 'Mess';

        if (isFavorite(messId)) {
            dispatch(removeSavedMess(messId));
            Toast.show({
                type: 'info',
                text1: 'Running...',
                text2: `${messName} removed from favorites`,
            });
        } else {
            dispatch(saveMess(messId));
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: `${messName} added to favorites`,
            });
        }
    };

    const loadMore = () => {
        if (pagination?.hasNext && !isLoading) {
            loadMesses((pagination.currentPage || 1) + 1);
        }
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colorScheme === 'dark' ? '#000000' : '#E5E7EB'
            }}
            edges={['top']}
        >
            {/* Main Content */}
            <View className="flex-1">
                {/* Search Header & Quick Filters */}
                <View className={`${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white'} px-4 pt-4 pb-4 shadow-sm rounded-t-3xl mx-4 mb-6`}>
                    <View className="flex-row items-center gap-3 mb-4">
                        <View className={`flex-1 flex-row items-center ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl px-4 h-12`}>
                            <Search size={20} color={Colors.gray[500]} />
                            <TextInput
                                placeholder="Search mess, location..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={handleSearch}
                                returnKeyType="search"
                                className={`flex-1 ml-3 text-base h-full ${colorScheme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
                                placeholderTextColor={Colors.gray[500]}
                                style={{ textAlignVertical: 'center', paddingVertical: 0 }}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <X size={18} color={Colors.gray[500]} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={() => setShowFilters(true)}
                            className="w-11 h-11 bg-primary-500 rounded-xl items-center justify-center"
                        >
                            <SlidersHorizontal size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Quick Filters */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                        {['All', 'Available', 'Top Rated', 'Lowest Price'].map((filter) => (
                            <TouchableOpacity
                                key={filter}
                                onPress={() => {
                                    if (filter === 'Lowest Price') {
                                        setLocalFilters((prev) => ({ ...prev, sortBy: 'price', sortOrder: 'asc' }));
                                    } else if (filter === 'Top Rated') {
                                        setLocalFilters((prev) => ({ ...prev, sortBy: 'rating', sortOrder: 'desc' }));
                                    }
                                    loadMesses(1);
                                }}
                                className={`px-4 py-2 rounded-full mr-2 ${filter === 'All' ? 'bg-primary-500' : (colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100')
                                    }`}
                            >
                                <Text className={filter === 'All' ? 'text-white font-medium' : (colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Results List */}
                <FlatList
                    data={messes}
                    renderItem={({ item }) => (
                        <View className="px-4 mb-4">
                            <MessCard
                                mess={item}
                                onPress={() => router.push(`/mess/${item._id}`)}
                                onFavoritePress={user ? () => handleFavoriteToggle(item._id) : undefined}
                                isFavorite={isFavorite(item._id)}
                            />
                        </View>
                    )}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={() => (
                        !isLoading ? (
                            <View className="items-center justify-center py-20">
                                <MapPin size={48} color={Colors.gray[300]} />
                                <Text className={`${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-4 text-center text-lg`}>
                                    No messes found
                                </Text>
                                <Text className={`${colorScheme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-2 text-center`}>
                                    Try adjusting your search or filters
                                </Text>
                            </View>
                        ) : null
                    )}
                    ListFooterComponent={() => (
                        isLoading ? <Loading text="Loading results..." /> : null
                    )}
                />
            </View>

            {/* Filter Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showFilters}
                onRequestClose={() => setShowFilters(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className={`${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-t-3xl h-[85%] w-full flex-col`}>
                        {/* Modal Header */}
                        <View className={`flex-row justify-between items-center p-5 border-b ${colorScheme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
                            <Text className={`text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Filters</Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)} className="p-2">
                                <X size={24} color={Colors.gray[500]} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="flex-1 px-5 pt-2" showsVerticalScrollIndicator={false}>
                            {/* Location */}
                            <View className="mb-6 mt-4">
                                <Text className={`${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium mb-3`}>Location</Text>
                                <TextInput
                                    placeholder="Enter location"
                                    value={localFilters.location}
                                    onChangeText={(v) => setLocalFilters((prev) => ({ ...prev, location: v }))}
                                    className={`${colorScheme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'} rounded-xl px-4 py-3.5`}
                                    placeholderTextColor={Colors.gray[400]}
                                />
                            </View>

                            {/* Room Type */}
                            <View className="mb-6">
                                <Text className={`${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium mb-3`}>Room Type</Text>
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
                                            className={`px-5 py-2.5 rounded-full border ${localFilters.roomType === type
                                                ? 'bg-primary-500 border-primary-500'
                                                : (colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-300')
                                                }`}
                                        >
                                            <Text
                                                className={
                                                    localFilters.roomType === type ? 'text-white font-medium' : (colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600')
                                                }
                                            >
                                                {type}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Gender Preference */}
                            <View className="mb-6">
                                <Text className={`${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium mb-3`}>Gender Preference</Text>
                                <View className="flex-row gap-3">
                                    {GenderPreferences.map((pref) => (
                                        <TouchableOpacity
                                            key={pref}
                                            onPress={() =>
                                                setLocalFilters((prev) => ({
                                                    ...prev,
                                                    genderPreference: prev.genderPreference === pref ? '' : pref,
                                                }))
                                            }
                                            className={`flex-1 py-3.5 rounded-xl border items-center ${localFilters.genderPreference === pref
                                                ? 'bg-primary-500 border-primary-500'
                                                : (colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-300')
                                                }`}
                                        >
                                            <Text
                                                className={
                                                    localFilters.genderPreference === pref ? 'text-white font-medium' : (colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600')
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
                                <Text className={`${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium mb-3`}>Sort By</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {([
                                        { label: 'Latest', value: 'createdAt' },
                                        { label: 'Price', value: 'price' },
                                        { label: 'Rating', value: 'rating' },
                                        { label: 'Views', value: 'views' },
                                    ] as { label: string; value: 'createdAt' | 'price' | 'rating' | 'views' }[]).map((item) => (
                                        <TouchableOpacity
                                            key={item.value}
                                            onPress={() =>
                                                setLocalFilters((prev) => ({
                                                    ...prev,
                                                    sortBy: item.value,
                                                }))
                                            }
                                            className={`px-5 py-2.5 rounded-full border ${localFilters.sortBy === item.value
                                                ? 'bg-secondary-500 border-secondary-500'
                                                : (colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-300')
                                                }`}
                                        >
                                            <Text
                                                className={
                                                    localFilters.sortBy === item.value ? 'text-white font-medium' : (colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600')
                                                }
                                            >
                                                {item.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View className="h-20" />
                        </ScrollView>

                        {/* Modal Actions */}
                        <View className={`px-5 py-4 border-t ${colorScheme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
                            <View className="flex-row">
                                <Button
                                    title="Clear"
                                    onPress={() => {
                                        clearFilters();
                                        setShowFilters(false);
                                    }}
                                    variant="outline"
                                    className="flex-1 mr-2"
                                />

                                <Button
                                    title="Apply Filters"
                                    onPress={applyFilters}
                                    className="flex-1"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
