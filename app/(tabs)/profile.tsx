import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
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
    X,
    Sun,
    Moon,
} from 'lucide-react-native';
import { Switch } from 'react-native';
import { useColorScheme } from 'nativewind';
import Toast from 'react-native-toast-message';
import { Avatar, Button, Input } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { logout, updateProfile } from '../../store/slices/authSlice';
import { Colors } from '../../constants';

export default function ProfileScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
    const { colorScheme, toggleColorScheme } = useColorScheme();

    useEffect(() => {
        console.log('🎨 Current color scheme:', colorScheme);
    }, [colorScheme]);

    // Edit Profile State
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');

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

    const handleEditProfile = () => {
        if (user) {
            setEditName(user.name);
            setEditEmail(user.email);
            setEditPhone(user.phone);
            setEditModalVisible(true);
        }
    };

    const handleSaveProfile = async () => {
        if (!editName.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Name is required',
            });
            return;
        }

        try {
            if (!user?.id && !user?._id) {
                throw new Error("User ID not found");
            }
            const userId = user.id || user._id || "";
            await dispatch(updateProfile({ id: userId, data: { name: editName } })).unwrap();
            setEditModalVisible(false);
            Toast.show({
                type: 'success',
                text1: 'Profile updated successfully',
            });
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Failed to update profile',
                text2: error || 'Please try again',
            });
        }
    };

    const menuItems = [
        {
            section: 'Account',
            items: [
                { icon: User, label: 'Edit Profile', onPress: handleEditProfile },
                { icon: Star, label: 'My Reviews', onPress: () => router.push('/reviews' as any) },
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
                {
                    icon: colorScheme === 'dark' ? Sun : Moon,
                    label: 'Dark Mode',
                    rightElement: (
                        <Switch
                            value={colorScheme === 'dark'}
                            onValueChange={toggleColorScheme}
                            trackColor={{ false: Colors.gray[200], true: Colors.primary[500] }}
                            thumbColor={Colors.white}
                        />
                    ),
                    onPress: () => { toggleColorScheme(); },
                },
            ],
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-200 dark:bg-black" edges={['top']}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View className="bg-white dark:bg-gray-900 px-6 py-8 items-center">
                    <Avatar name={user?.name} size="xl" />
                    <Text className="text-xl font-bold text-gray-800 dark:text-white mt-4">{user?.name || 'Guest'}</Text>
                    <View className="flex-row items-center mt-1">
                        <View className="bg-primary-100 px-3 py-1 rounded-full">
                            <Text className="text-primary-700 text-sm font-medium capitalize">
                                {user?.role || 'User'}
                            </Text>
                        </View>
                    </View>

                    {/* Contact Info */}
                    <View className="w-full mt-6 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
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
                {menuItems.map((section) => (
                    <View key={section.section} className="mt-4 mx-2">
                        <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium px-6 mb-2">
                            {section.section}
                        </Text>
                        <View className="bg-white dark:bg-gray-900 rounded-2xl">
                            {section.items.map((item, itemIndex) => (
                                <TouchableOpacity
                                    key={item.label}
                                    onPress={item.onPress}
                                    className={`flex-row items-center px-6 py-4 ${itemIndex < section.items.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
                                        }`}
                                >
                                    <View className="flex-row items-center flex-1">
                                        <View className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl items-center justify-center">
                                            <item.icon size={20} color={Colors.gray[600]} />
                                        </View>
                                        <Text className="ml-4 text-gray-800 dark:text-white font-medium">{item.label}</Text>
                                    </View>
                                    {/* @ts-ignore */}
                                    {item.rightElement ? item.rightElement : <ChevronRight size={20} color={Colors.gray[400]} />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Logout Button */}
                <View className="mx-2 my-5">
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

            {/* Edit Profile Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1 justify-end bg-black/50">
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        >
                            <View className="bg-white dark:bg-gray-900 rounded-3xl mx-2 p-6 h-[90%]">
                                <View className="flex-row justify-between items-center mb-6">
                                    <Text className="text-xl font-bold text-gray-800 dark:text-white">Edit Profile</Text>
                                    <TouchableOpacity
                                        onPress={() => setEditModalVisible(false)}
                                        className="p-2 bg-gray-100 rounded-full"
                                    >
                                        <X size={20} color={Colors.gray[600]} />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View className="items-center mb-8">
                                        <Avatar name={editName} size="xl" />
                                    </View>

                                    <Input
                                        label="Name"
                                        value={editName}
                                        onChangeText={setEditName}
                                        placeholder="Enter your name"
                                        icon={<User size={20} color={Colors.gray[400]} />}
                                    />

                                    <Input
                                        label="Email"
                                        value={editEmail}
                                        onChangeText={() => { }}
                                        editable={false}
                                        className="mt-4"
                                        icon={<Mail size={20} color={Colors.gray[400]} />}
                                    />
                                    <Text className="text-xs text-gray-500 mt-1 ml-1 mb-4">
                                        Email cannot be changed
                                    </Text>

                                    <Input
                                        label="Phone Number"
                                        value={editPhone}
                                        onChangeText={() => { }}
                                        editable={false}
                                        icon={<Phone size={20} color={Colors.gray[400]} />}
                                    />
                                    <Text className="text-xs text-gray-500 mt-1 ml-1 mb-6">
                                        Phone number cannot be changed
                                    </Text>

                                    <Button
                                        title="Save Changes"
                                        onPress={handleSaveProfile}
                                        loading={isLoading}
                                        className="mt-4 mb-8"
                                    />
                                </ScrollView>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
}
