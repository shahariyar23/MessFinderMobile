import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    TextInput,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, Search, X, Ban, CheckCircle } from 'lucide-react-native';
import { Colors } from '../../constants';
import { Loading, Avatar, Badge } from '../../components/ui';
import { User } from '../../types';

export default function OwnerActivity() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [owners, setOwners] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOwner, setSelectedOwner] = useState<User | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        loadOwners();
    }, []);

    const loadOwners = async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await adminService.getAllOwners();
            setOwners([]);
        } catch (error) {
            console.error('Failed to load owners:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadOwners();
        setRefreshing(false);
    };

    const handleToggleStatus = async (userId: string, isActive: boolean) => {
        try {
            // TODO: API call
            console.log('Toggle status:', userId, isActive);
            loadOwners();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const filteredOwners = owners.filter(
        (owner) =>
            owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            owner.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderOwnerCard = ({ item }: { item: User }) => (
        <TouchableOpacity
            onPress={() => {
                setSelectedOwner(item);
                setShowDetailModal(true);
            }}
            className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
        >
            <View className="flex-row items-center">
                <Avatar name={item.name} size={50} />
                <View className="flex-1 ml-3">
                    <Text className="text-base font-bold text-gray-800">{item.name}</Text>
                    <Text className="text-sm text-gray-500 mt-1">{item.email}</Text>
                    <Text className="text-sm text-gray-400 mt-1">{item.phone}</Text>
                </View>
                <View className="items-end">
                    <Badge
                        label={item.isActive ? 'Active' : 'Inactive'}
                        variant={item.isActive ? 'success' : 'error'}
                    />
                    <Text className="text-xs text-gray-400 mt-1">0 listings</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return <Loading fullScreen text="Loading owners..." />;
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
            {/* Search Bar */}
            <View className="bg-white px-4 py-3 shadow-sm">
                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                    <Search size={20} color={Colors.gray[400]} />
                    <TextInput
                        placeholder="Search owners..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-3 text-gray-800"
                        placeholderTextColor={Colors.gray[400]}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X size={18} color={Colors.gray[400]} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Owner List */}
            <FlatList
                data={filteredOwners}
                keyExtractor={(item) => item.id || item._id || ''}
                renderItem={renderOwnerCard}
                contentContainerStyle={{ padding: 16 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={() => (
                    <View className="items-center py-12">
                        <Building2 size={64} color={Colors.gray[300]} />
                        <Text className="text-gray-500 mt-4 text-center">No owners found</Text>
                    </View>
                )}
            />

            {/* Detail Modal */}
            <Modal visible={showDetailModal} animationType="slide" transparent>
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6 max-h-[70%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-800">Owner Details</Text>
                            <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                                <X size={24} color={Colors.gray[600]} />
                            </TouchableOpacity>
                        </View>

                        {selectedOwner && (
                            <View>
                                <View className="items-center mb-6">
                                    <Avatar name={selectedOwner.name} size={80} />
                                    <Text className="text-xl font-bold text-gray-800 mt-3">
                                        {selectedOwner.name}
                                    </Text>
                                    <Badge
                                        label={selectedOwner.isActive ? 'Active' : 'Inactive'}
                                        variant={selectedOwner.isActive ? 'success' : 'error'}
                                    />
                                </View>

                                <View className="space-y-3 mb-6">
                                    <View>
                                        <Text className="text-sm font-medium text-gray-500">Email</Text>
                                        <Text className="text-gray-800 mt-1">{selectedOwner.email}</Text>
                                    </View>
                                    <View>
                                        <Text className="text-sm font-medium text-gray-500">Phone</Text>
                                        <Text className="text-gray-800 mt-1">{selectedOwner.phone}</Text>
                                    </View>
                                    <View>
                                        <Text className="text-sm font-medium text-gray-500">Total Listings</Text>
                                        <Text className="text-gray-800 mt-1">0 messes</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        handleToggleStatus(
                                            selectedOwner.id || selectedOwner._id || '',
                                            !selectedOwner.isActive
                                        );
                                        setShowDetailModal(false);
                                    }}
                                    className={`flex-row items-center justify-center py-4 rounded-xl ${selectedOwner.isActive ? 'bg-red-50' : 'bg-green-50'
                                        }`}
                                >
                                    {selectedOwner.isActive ? (
                                        <>
                                            <Ban size={20} color={Colors.error} />
                                            <Text className="text-red-600 font-medium ml-2">
                                                Deactivate Account
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={20} color={Colors.success} />
                                            <Text className="text-green-600 font-medium ml-2">
                                                Activate Account
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
