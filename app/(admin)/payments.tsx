import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard, DollarSign, X, Filter } from 'lucide-react-native';
import { Colors, PaymentStatusColors } from '../../constants';
import { Loading, Badge } from '../../components/ui';

interface Payment {
    _id: string;
    user: { name: string; email: string };
    mess: { title: string };
    amount: number;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
    paymentMethod: string;
    createdAt: string;
}

export default function PaymentHistory() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'failed'>('all');

    useEffect(() => {
        loadPayments();
    }, [filterStatus]);

    const loadPayments = async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await adminService.getAllPayments(filterStatus);
            setPayments([]);
        } catch (error) {
            console.error('Failed to load payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadPayments();
        setRefreshing(false);
    };

    const getStatusVariant = (status: string): any => {
        switch (status) {
            case 'paid':
                return 'success';
            case 'pending':
                return 'warning';
            case 'failed':
            case 'refunded':
                return 'error';
            default:
                return 'primary';
        }
    };

    const renderPaymentCard = ({ item }: { item: Payment }) => (
        <TouchableOpacity
            onPress={() => {
                setSelectedPayment(item);
                setShowDetailModal(true);
            }}
            className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
        >
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 mr-3">
                    <Text className="text-base font-bold text-gray-800" numberOfLines={1}>
                        {item.mess.title}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">{item.user.name}</Text>
                </View>
                <Badge label={item.status} variant={getStatusVariant(item.status)} />
            </View>

            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-2xl font-bold text-primary-600">৳{item.amount}</Text>
                    <Text className="text-xs text-gray-400 mt-1">
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>
                <View className="items-end">
                    <Text className="text-sm text-gray-500">{item.paymentMethod}</Text>
                    {item.transactionId && (
                        <Text className="text-xs text-gray-400 mt-1">#{item.transactionId}</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return <Loading fullScreen text="Loading payments..." />;
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
            {/* Filter Tabs */}
            <View className="bg-white px-4 py-3 shadow-sm">
                <View className="flex-row gap-2">
                    {['all', 'paid', 'pending', 'failed'].map((status) => (
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
                </View>
            </View>

            {/* Payment List */}
            <FlatList
                data={payments}
                keyExtractor={(item) => item._id}
                renderItem={renderPaymentCard}
                contentContainerStyle={{ padding: 16 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={() => (
                    <View className="items-center py-12">
                        <CreditCard size={64} color={Colors.gray[300]} />
                        <Text className="text-gray-500 mt-4 text-center">No payments found</Text>
                    </View>
                )}
            />

            {/* Detail Modal */}
            <Modal visible={showDetailModal} animationType="slide" transparent>
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-800">Payment Details</Text>
                            <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                                <X size={24} color={Colors.gray[600]} />
                            </TouchableOpacity>
                        </View>

                        {selectedPayment && (
                            <View>
                                <View className="items-center mb-6">
                                    <Text className="text-3xl font-bold text-primary-600">
                                        ৳{selectedPayment.amount}
                                    </Text>
                                    <Badge
                                        label={selectedPayment.status}
                                        variant={getStatusVariant(selectedPayment.status)}
                                    />
                                </View>

                                <View className="space-y-3">
                                    <View>
                                        <Text className="text-sm font-medium text-gray-500">Mess</Text>
                                        <Text className="text-gray-800 mt-1">{selectedPayment.mess.title}</Text>
                                    </View>
                                    <View>
                                        <Text className="text-sm font-medium text-gray-500">Student</Text>
                                        <Text className="text-gray-800 mt-1">{selectedPayment.user.name}</Text>
                                        <Text className="text-gray-500 text-sm">{selectedPayment.user.email}</Text>
                                    </View>
                                    <View>
                                        <Text className="text-sm font-medium text-gray-500">Payment Method</Text>
                                        <Text className="text-gray-800 mt-1">{selectedPayment.paymentMethod}</Text>
                                    </View>
                                    {selectedPayment.transactionId && (
                                        <View>
                                            <Text className="text-sm font-medium text-gray-500">
                                                Transaction ID
                                            </Text>
                                            <Text className="text-gray-800 mt-1">
                                                {selectedPayment.transactionId}
                                            </Text>
                                        </View>
                                    )}
                                    <View>
                                        <Text className="text-sm font-medium text-gray-500">Date</Text>
                                        <Text className="text-gray-800 mt-1">
                                            {new Date(selectedPayment.createdAt).toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
