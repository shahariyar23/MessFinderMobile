import React, { useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    User,
    Mail,
    Phone,
    Settings,
    HelpCircle,
    FileText,
    Shield,
    LogOut,
    ChevronRight,
    Star,
    Building,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Avatar, Button } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { logout } from '../../store/slices/authSlice';
import { Colors } from '../../constants';

export default function ProfileScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/(auth)/login');
        }
    }, [isAuthenticated, router]);

    // Show nothing while redirecting (prevents flash of profile content)
    if (!isAuthenticated) {
        return null;
    }

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await dispatch(logout());
                        Toast.show({
                            type: 'success',
                            text1: 'Logged out',
                            text2: 'See you again soon!',
                        });
                    },
                },
            ]
        );
    };

    const menuItems = [
        {
            section: 'Account',
            items: [
                { icon: User, label: 'Edit Profile', onPress: () => { } },
                { icon: Star, label: 'My Reviews', onPress: () => { } },
                ...(user?.role === 'owner'
                    ? [{ icon: Building, label: 'My Messes', onPress: () => { } }]
                    : []),
            ],
        },
        {
            section: 'Support',
            items: [
                { icon: HelpCircle, label: 'Help Center', onPress: () => { } },
                { icon: FileText, label: 'Terms of Service', onPress: () => { } },
                { icon: Shield, label: 'Privacy Policy', onPress: () => { } },
            ],
        },
        {
            section: 'Settings',
            items: [
                { icon: Settings, label: 'App Settings', onPress: () => { } },
            ],
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View className="bg-white px-6 py-8 items-center">
                    <Avatar name={user?.name} size="xl" />
                    <Text className="text-xl font-bold text-gray-800 mt-4">{user?.name || 'Guest'}</Text>
                    <View className="flex-row items-center mt-1">
                        <View className="bg-primary-100 px-3 py-1 rounded-full">
                            <Text className="text-primary-700 text-sm font-medium capitalize">
                                {user?.role || 'User'}
                            </Text>
                        </View>
                    </View>

                    {/* Contact Info */}
                    <View className="w-full mt-6 bg-gray-50 rounded-2xl p-4">
                        <View className="flex-row items-center mb-3">
                            <Mail size={18} color={Colors.gray[500]} />
                            <Text className="text-gray-600 ml-3">{user?.email || 'No email'}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Phone size={18} color={Colors.gray[500]} />
                            <Text className="text-gray-600 ml-3">{user?.phone || 'No phone'}</Text>
                        </View>
                    </View>
                </View>

                {/* Menu Sections */}
                {menuItems.map((section, sectionIndex) => (
                    <View key={section.section} className="mt-4">
                        <Text className="text-gray-500 text-sm font-medium px-6 mb-2">
                            {section.section}
                        </Text>
                        <View className="bg-white">
                            {section.items.map((item, itemIndex) => (
                                <TouchableOpacity
                                    key={item.label}
                                    onPress={item.onPress}
                                    className={`flex-row items-center px-6 py-4 ${itemIndex < section.items.length - 1 ? 'border-b border-gray-100' : ''
                                        }`}
                                >
                                    <View className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center">
                                        <item.icon size={20} color={Colors.gray[600]} />
                                    </View>
                                    <Text className="flex-1 ml-4 text-gray-800 font-medium">{item.label}</Text>
                                    <ChevronRight size={20} color={Colors.gray[400]} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Logout Button */}
                <View className="px-6 mt-6 mb-8">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="flex-row items-center justify-center bg-red-50 py-4 rounded-2xl"
                    >
                        <LogOut size={20} color={Colors.error} />
                        <Text className="text-red-600 font-semibold ml-2">Logout</Text>
                    </TouchableOpacity>
                </View>

                {/* App Version */}
                <Text className="text-center text-gray-400 text-sm mb-6">
                    Mess Finder v1.0.0
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
