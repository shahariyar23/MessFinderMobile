import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    Users,
    Building2,
    DollarSign,
    Calendar,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock
} from 'lucide-react-native';
import { Colors } from '../../constants';
import { Loading } from '../../components/ui';
import { useAppSelector } from '../../hooks/useRedux';

interface StatCard {
    title: string;
    value: string;
    icon: any;
    color: string;
    bgColor: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalOwners: 0,
        totalMesses: 0,
        totalBookings: 0,
        totalRevenue: 0,
        pendingApprovals: 0,
        activeBookings: 0,
        completedBookings: 0,
    });

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            // TODO: Replace with actual admin API call
            // const response = await adminService.getDashboardStats();

            // Mock data for now
            setStats({
                totalStudents: 1250,
                totalOwners: 85,
                totalMesses: 120,
                totalBookings: 3420,
                totalRevenue: 458000,
                pendingApprovals: 12,
                activeBookings: 245,
                completedBookings: 3175,
            });
        } catch (error) {
            console.error('Failed to load dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadDashboardStats();
        setRefreshing(false);
    };

    const statCards: StatCard[] = [
        {
            title: 'Total Students',
            value: stats.totalStudents.toString(),
            icon: Users,
            color: Colors.primary[600],
            bgColor: Colors.primary[50],
        },
        {
            title: 'Mess Owners',
            value: stats.totalOwners.toString(),
            icon: Building2,
            color: Colors.secondary[600],
            bgColor: Colors.secondary[50],
        },
        {
            title: 'Active Messes',
            value: stats.totalMesses.toString(),
            icon: Building2,
            color: Colors.accent[600],
            bgColor: Colors.accent[50],
        },
        {
            title: 'Total Bookings',
            value: stats.totalBookings.toString(),
            icon: Calendar,
            color: Colors.primary[600],
            bgColor: Colors.primary[50],
        },
        {
            title: 'Total Revenue',
            value: `৳${(stats.totalRevenue / 1000).toFixed(0)}K`,
            icon: DollarSign,
            color: Colors.success,
            bgColor: '#dcfce7',
        },
        {
            title: 'Pending Approvals',
            value: stats.pendingApprovals.toString(),
            icon: AlertCircle,
            color: Colors.warning,
            bgColor: '#fef3c7',
        },
    ];

    if (loading) {
        return <Loading fullScreen text="Loading dashboard..." />;
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Welcome Header */}
                <View className="bg-white px-5 py-6 shadow-sm">
                    <Text className="text-2xl font-bold text-gray-800">Welcome back, Admin</Text>
                    <Text className="text-gray-500 mt-1">{user?.name}</Text>
                </View>

                {/* Quick Stats */}
                <View className="px-4 py-5">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Overview</Text>
                    <View className="flex-row flex-wrap -mx-2">
                        {statCards.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <View key={index} className="w-1/2 px-2 mb-4">
                                    <View className="bg-white rounded-2xl p-4 shadow-sm">
                                        <View
                                            className="w-12 h-12 rounded-xl items-center justify-center mb-3"
                                            style={{ backgroundColor: stat.bgColor }}
                                        >
                                            <Icon size={24} color={stat.color} />
                                        </View>
                                        <Text className="text-2xl font-bold text-gray-800">{stat.value}</Text>
                                        <Text className="text-sm text-gray-500 mt-1">{stat.title}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Booking Status */}
                <View className="px-4 pb-5">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Booking Status</Text>
                    <View className="bg-white rounded-2xl p-4 shadow-sm">
                        <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center mr-3">
                                    <Clock size={20} color={Colors.primary[600]} />
                                </View>
                                <Text className="text-gray-700 font-medium">Active Bookings</Text>
                            </View>
                            <Text className="text-lg font-bold text-gray-800">{stats.activeBookings}</Text>
                        </View>

                        <View className="flex-row items-center justify-between py-3">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center mr-3">
                                    <CheckCircle size={20} color={Colors.success} />
                                </View>
                                <Text className="text-gray-700 font-medium">Completed</Text>
                            </View>
                            <Text className="text-lg font-bold text-gray-800">{stats.completedBookings}</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="px-4 pb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
                    <View className="space-y-3">
                        <TouchableOpacity
                            onPress={() => router.push('/(admin)/messes')}
                            className="bg-white rounded-xl p-4 shadow-sm flex-row items-center justify-between"
                        >
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-warning-50 items-center justify-center mr-3">
                                    <AlertCircle size={20} color={Colors.warning} />
                                </View>
                                <Text className="text-gray-700 font-medium">Review Pending Messes</Text>
                            </View>
                            <View className="bg-warning-100 px-3 py-1 rounded-full">
                                <Text className="text-warning-700 font-bold">{stats.pendingApprovals}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/(admin)/bookings-admin')}
                            className="bg-white rounded-xl p-4 shadow-sm flex-row items-center justify-between"
                        >
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center mr-3">
                                    <Calendar size={20} color={Colors.primary[600]} />
                                </View>
                                <Text className="text-gray-700 font-medium">Manage Bookings</Text>
                            </View>
                            <TrendingUp size={20} color={Colors.gray[400]} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
