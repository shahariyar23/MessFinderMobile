import React, { useEffect, useState, ReactNode, JSX } from 'react';
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
    Switch,
} from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

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

import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Avatar, Button, Input } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { logout, updateProfile } from '../../store/slices/authSlice';
import { Colors } from '../../constants';



/* ----------------------------- */
/* Types */
/* ----------------------------- */

interface MenuItem {
    icon: any;
    label: string;
    onPress: () => void;
    rightElement?: ReactNode;
}

interface MenuSection {
    section: string;
    items: MenuItem[];
}

/* ----------------------------- */
/* Component */
/* ----------------------------- */

export default function ProfileScreen(): ReactNode {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { user, isAuthenticated, isLoading } =
        useAppSelector((state) => state.auth);

    const { colorScheme, setColorScheme } = useColorScheme();

    /* ----------------------------- */
    /* State */
    /* ----------------------------- */

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');

    /* ----------------------------- */
    /* Load Saved Theme */
    /* ----------------------------- */

    useEffect(() => {
        const loadTheme = async (): Promise<void> => {
            try {
                const saved = await AsyncStorage.getItem('colorScheme');

                if (saved === 'dark' || saved === 'light') {
                    setColorScheme(saved);
                }
            } catch (err) {
                console.log('Theme load error:', err);
            }
        };

        loadTheme();
    }, []);

    /* ----------------------------- */
    /* Auth Redirect */
    /* ----------------------------- */

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/(auth)/login');
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) return null;

    /* ----------------------------- */
    /* Theme Toggle */
    /* ----------------------------- */

    const toggleTheme = async (): Promise<void> => {
        const next = colorScheme === 'dark' ? 'light' : 'dark';

        setColorScheme(next);

        try {
            await AsyncStorage.setItem('colorScheme', next);
        } catch (err) {
            console.log('Theme save error:', err);
        }
    };

    /* ----------------------------- */
    /* Logout */
    /* ----------------------------- */

    const handleLogout = (): void => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
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
        ]);
    };

    /* ----------------------------- */
    /* Edit Profile */
    /* ----------------------------- */

    const handleEditProfile = (): void => {
        if (!user) return;

        setEditName(user.name);
        setEditEmail(user.email);
        setEditPhone(user.phone);

        setEditModalVisible(true);
    };

    const handleSaveProfile = async (): Promise<void> => {
        if (!editName.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Name is required',
            });
            return;
        }

        try {
            const userId = user?.id || user?._id;

            if (!userId) throw new Error('User ID not found');

            await dispatch(
                updateProfile({
                    id: userId,
                    data: { name: editName },
                })
            ).unwrap();

            setEditModalVisible(false);

            Toast.show({
                type: 'success',
                text1: 'Profile updated',
            });
        } catch (err: unknown) {
            let message = 'Please try again';

            if (err instanceof Error) {
                message = err.message;
            }

            Toast.show({
                type: 'error',
                text1: 'Update failed',
                text2: message,
            });
        }
    };

    /* ----------------------------- */
    /* Menu */
    /* ----------------------------- */

    const menuItems: { section: string; items: MenuItem[] }[] = [
        {
            section: 'Account',
            items: [
                {
                    icon: User,
                    label: 'Edit Profile',
                    onPress: handleEditProfile,
                },
                {
                    icon: Star,
                    label: 'My Reviews',
                    onPress: () => router.push('/reviews' as any),
                },
                ...(user?.role === 'owner'
                    ? [
                        {
                            icon: Building,
                            label: 'My Messes',
                            onPress: () => { },
                        },
                    ]
                    : []),
            ],
        },

        {
            section: 'Support',
            items: [
                {
                    icon: HelpCircle,
                    label: 'Help Center',
                    onPress: () => { },
                },
                {
                    icon: FileText,
                    label: 'Terms of Service',
                    onPress: () => { },
                },
                {
                    icon: Shield,
                    label: 'Privacy Policy',
                    onPress: () => { },
                },
            ],
        },

        {
            section: 'Settings',
            items: [
                {
                    icon: Settings,
                    label: 'App Settings',
                    onPress: () => { },
                },
                {
                    icon: colorScheme === 'dark' ? Sun : Moon,
                    label: 'Dark Mode',
                    onPress: toggleTheme,
                    rightElement: (
                        <Switch
                            value={colorScheme === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{
                                false: Colors.gray[200],
                                true: Colors.primary[500],
                            }}
                            thumbColor={Colors.white}
                        />
                    ),
                },
            ],
        },
    ];
    console.log(user, "user from user profile")
    /* ----------------------------- */
    /* UI */
    /* ----------------------------- */

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colorScheme === 'dark' ? '#000000' : '#E5E7EB'
            }}
            edges={['top']}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}

                <View className={`${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white'} px-6 py-8 items-center mx-2 rounded-3xl`}>
                    <Avatar name={user?.name} size="xl" />

                    <Text className={`text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'} mt-4`}>
                        {user?.name}
                    </Text>

                    <View className="bg-primary-100 px-3 py-1 rounded-full mt-1">
                        <Text className="text-primary-700 capitalize">
                            {user?.role}
                        </Text>
                    </View>

                    {/* Contact */}

                    <View className={`w-full mt-6 ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl p-4`}>
                        <View className="flex-row items-center mb-3">
                            <Mail size={18} color={Colors.gray[500]} />
                            <Text className={`ml-3 ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {user?.email}
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            <Phone size={18} color={Colors.gray[500]} />
                            <Text className={`ml-3 ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {user?.phone}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Menu */}

                {menuItems.map((section) => (
                    <View key={section.section} className="mt-4 mx-2">
                        <Text className={`${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} px-6 mb-2`}>
                            {section.section}
                        </Text>

                        <View className={`${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl`}>
                            {section.items.map((item, index) => (
                                <TouchableOpacity
                                    key={item.label}
                                    onPress={item.onPress}
                                    className={`flex-row items-center px-6 py-4 ${index <
                                        section.items.length - 1
                                        ? `border-b ${colorScheme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`
                                        : ''
                                        }`}
                                >
                                    <View className="flex-row items-center flex-1">
                                        <View className={`w-10 h-10 ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl items-center justify-center`}>
                                            <item.icon
                                                size={20}
                                                color={
                                                    colorScheme === 'dark'
                                                        ? Colors.white
                                                        : Colors.gray[600]
                                                }
                                            />
                                        </View>

                                        <Text className={`ml-4 ${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'} font-medium`}>
                                            {item.label}
                                        </Text>
                                    </View>

                                    {item.rightElement || (
                                        <ChevronRight
                                            size={20}
                                            color={Colors.gray[400]}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Logout */}

                <View className="mx-2 my-5">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="flex-row items-center justify-center bg-red-50 py-4 rounded-2xl"
                    >
                        <LogOut size={20} color={Colors.error} />

                        <Text className="ml-2 text-red-600 font-semibold">
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-center text-gray-400 mb-6">
                    Mess Finder v1.0.0
                </Text>
            </ScrollView>

            {/* Edit Modal */}

            <Modal
                animationType="slide"
                transparent
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1 justify-end bg-black/50">
                        <KeyboardAvoidingView
                            behavior={
                                Platform.OS === 'ios'
                                    ? 'padding'
                                    : 'height'
                            }
                        >
                            <View className={`${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-3xl mx-2 p-6 h-[90%]`}>
                                <View className="flex-row justify-between items-center mb-6">
                                    <Text className={`text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                        Edit Profile
                                    </Text>

                                    <TouchableOpacity
                                        onPress={() =>
                                            setEditModalVisible(false)
                                        }
                                        className={`p-2 ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-full`}
                                    >
                                        <X
                                            size={20}
                                            color={
                                                colorScheme === 'dark'
                                                    ? Colors.white
                                                    : Colors.gray[600]
                                            }
                                        />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView>
                                    <View className="items-center mb-8">
                                        <Avatar name={editName} size="xl" />
                                    </View>

                                    <Input
                                        label="Name"
                                        value={editName}
                                        onChangeText={setEditName}
                                        placeholder="Enter name"
                                        icon={
                                            <User
                                                size={20}
                                                color={Colors.gray[400]}
                                            />
                                        }
                                    />

                                    <Input
                                        label="Email"
                                        value={editEmail}
                                        editable={false}
                                        className="mt-4"
                                        icon={
                                            <Mail
                                                size={20}
                                                color={Colors.gray[400]}
                                            />
                                        }
                                    />

                                    <Input
                                        label="Phone"
                                        value={editPhone}
                                        editable={false}
                                        className="mt-4"
                                        icon={
                                            <Phone
                                                size={20}
                                                color={Colors.gray[400]}
                                            />
                                        }
                                    />

                                    <Button
                                        title="Save Changes"
                                        onPress={handleSaveProfile}
                                        loading={isLoading}
                                        className="mt-6 mb-8"
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