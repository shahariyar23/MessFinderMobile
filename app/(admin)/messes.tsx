import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, Plus, X, CheckCircle, XCircle, AlertCircle, Filter } from 'lucide-react-native';
import { Colors, BookingStatusColors } from '../../constants';
import { Loading, Button, Badge } from '../../components/ui';
import { Mess } from '../../types';

export default function AdminMessManagement() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [messes, setMesses] = useState<Mess[]>([]);
    const [selectedMess, setSelectedMess] = useState<Mess | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'free' | 'booked'>('all');

    useEffect(() => {
        loadMesses();
    }, [filterStatus]);

    const loadMesses = async () => {
        try {
            // TODO: Replace with actual admin API call
            // const response = await adminService.getAllMesses(filterStatus);

            // Mock data
            setMesses([]);
        } catch (error) {
            console.error('Failed to load messes:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadMesses();
        setRefreshing(false);
    };

    const handleApprove = async (messId: string) => {
        try {
            // TODO: API call to approve mess
            // await adminService.approveMess(messId);
            console.log('Approved mess:', messId);
            loadMesses();
        } catch (error) {
            console.error('Failed to approve mess:', error);
        }
    };

    const handleReject = async (messId: string) => {
        try {
            // TODO: API call to reject mess
            // await adminService.rejectMess(messId);
            console.log('Rejected mess:', messId);
            loadMesses();
        } catch (error) {
            console.error('Failed to reject mess:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return Colors.warning;
            case 'free':
                return Colors.success;
            case 'booked':
                return Colors.error;
            default:
                return Colors.gray[500];
        }
    };

    const renderMessCard = ({ item }: { item: Mess }) => (
        <TouchableOpacity
            onPress={() => {
                setSelectedMess(item);
                setShowDetailModal(true);
            }}
            className="bg-white rounded-2xl mb-4 overflow-hidden shadow-sm"
        >
            <View className="flex-row">
                <Image
                    source={{ uri: item.image?.[0]?.url || 'https://via.placeholder.com/120' }}
                    className="w-28 h-full"
                    resizeMode="cover"
                />
                <View className="flex-1 p-4">
                    <View className="flex-row items-start justify-between">
                        <View className="flex-1 mr-2">
                            <Text className="text-base font-bold text-gray-800" numberOfLines={1}>
                                {item.title}
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
                                {item.address}
                            </Text>
                        </View>
                        <Badge
                            label={item.status}
                            variant={item.status === 'pending' ? 'warning' : item.status === 'free' ? 'success' : 'error'}
                        />
                    </View>

                    <View className="flex-row items-center mt-3">
                        <Text className="text-primary-600 font-bold text-base">
                            ৳{item.payPerMonth}/month
                        </Text>
                        <Text className="text-gray-400 ml-2">• {item.roomType}</Text>
                    </View>

                    {item.status === 'pending' && (
                        <View className="flex-row gap-2 mt-3">
                            <Button
                                title="Approve"
                                onPress={() => handleApprove(item._id)}
                                variant="primary"
                                size="small"
                                className="flex-1"
                            />
                            <Button
                                title="Reject"
                                onPress={() => handleReject(item._id)}
                                variant="outline"
                                size="small"
                                className="flex-1"
                            />
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return <Loading fullScreen text="Loading messes..." />;
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
            {/* Filter Tabs */}
            <View className="bg-white px-4 py-3 shadow-sm">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                    {['all', 'pending', 'free', 'booked'].map((status) => (
                        <TouchableOpacity
                            key={status}
                            onPress={() => setFilterStatus(status as any)}
                            className={`px-4 py-2 rounded-full ${filterStatus === status ? 'bg-primary-500' : 'bg-gray-100'
                                }`}
                        >
                            <Text
                                className={
                                    filterStatus === status ? 'text-white font-medium' : 'text-gray-600'
                                }
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Mess List */}
            <FlatList
                data={messes}
                keyExtractor={(item) => item._id}
                renderItem={renderMessCard}
                contentContainerStyle={{ padding: 16 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={() => (
                    <View className="items-center py-12">
                        <Building2 size={64} color={Colors.gray[300]} />
                        <Text className="text-gray-500 mt-4 text-center">No messes found</Text>
                        <Text className="text-gray-400 text-sm text-center mt-1">
                            {filterStatus === 'pending'
                                ? 'No pending approvals'
                                : 'Try changing the filter'}
                        </Text>
                    </View>
                )}
            />

            {/* Detail Modal */}
            <Modal visible={showDetailModal} animationType="slide" transparent>
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl max-h-[80%]">
                        <View className="flex-row justify-between items-center p-5 border-b border-gray-200">
                            <Text className="text-xl font-bold text-gray-800">Mess Details</Text>
                            <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                                <X size={24} color={Colors.gray[600]} />
                            </TouchableOpacity>
                        </View>

                        {selectedMess && (
                            <ScrollView className="p-5">
                                <Text className="text-2xl font-bold text-gray-800 mb-2">
                                    {selectedMess.title}
                                </Text>
                                <Text className="text-gray-600 mb-4">{selectedMess.description}</Text>

                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-gray-500 mb-1">Address</Text>
                                    <Text className="text-gray-800">{selectedMess.address}</Text>
                                </View>

                                <View className="flex-row gap-4 mb-4">
                                    <View className="flex-1">
                                        <Text className="text-sm font-medium text-gray-500 mb-1">Price</Text>
                                        <Text className="text-lg font-bold text-primary-600">
                                            ৳{selectedMess.payPerMonth}/month
                                        </Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-sm font-medium text-gray-500 mb-1">Room Type</Text>
                                        <Text className="text-gray-800">{selectedMess.roomType}</Text>
                                    </View>
                                </View>

                                {selectedMess.status === 'pending' && (
                                    <View className="flex-row gap-3 mt-4">
                                        <Button
                                            title="Approve Mess"
                                            onPress={() => {
                                                handleApprove(selectedMess._id);
                                                setShowDetailModal(false);
                                            }}
                                            variant="primary"
                                            className="flex-1"
                                        />
                                        <Button
                                            title="Reject"
                                            onPress={() => {
                                                handleReject(selectedMess._id);
                                                setShowDetailModal(false);
                                            }}
                                            variant="outline"
                                            className="flex-1"
                                        />
                                    </View>
                                )}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
