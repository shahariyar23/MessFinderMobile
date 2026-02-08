import React from 'react';
import { View, Platform, StyleSheet, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Search, Heart, Calendar, User, LogIn } from 'lucide-react-native';
import { Colors } from '../../constants';
import { useAppSelector } from '../../hooks/useRedux';
import { useColorScheme } from 'nativewind';

export default function TabLayout() {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const { colorScheme } = useColorScheme();

    const isDark = colorScheme === 'dark';

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: isDark ? '#ffffff' : Colors.primary[500],
                tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#9CA3AF',
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    elevation: 5,
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    borderRadius: 35,
                    height: 80,
                    borderTopWidth: 0,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    paddingBottom: Platform.OS === 'ios' ? 25 : 15, // Adjust for OS
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 2,
                },
                headerShown: false,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size, focused }) => (
                        focused ? (
                            <View
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                    backgroundColor: Colors.primary[500],
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    top: -30,
                                    shadowColor: Colors.primary[500],
                                    shadowOffset: { width: 0, height: 10 },
                                    shadowOpacity: 0.4,
                                    shadowRadius: 10,
                                    elevation: 10,
                                    borderWidth: 4,
                                    borderColor: isDark ? '#111827' : '#f9fafb',
                                }}
                            >
                                <Home size={28} color="#fff" />
                            </View>
                        ) : (
                            <Home size={24} color={color} />
                        )
                    ),
                    tabBarLabel: ({ focused, color }) => (
                        focused ? null : <Text style={{ color, fontSize: 11, fontWeight: '600', marginTop: 2 }}>Home</Text>
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, size, focused }) => (
                        focused ? (
                            <View
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                    backgroundColor: Colors.primary[500],
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    top: -30,
                                    shadowColor: Colors.primary[500],
                                    shadowOffset: { width: 0, height: 10 },
                                    shadowOpacity: 0.4,
                                    shadowRadius: 10,
                                    elevation: 10,
                                    borderWidth: 4,
                                    borderColor: isDark ? '#111827' : '#f9fafb',
                                }}
                            >
                                <Search size={28} color="#fff" />
                            </View>
                        ) : (
                            <Search size={24} color={color} />
                        )
                    ),
                    tabBarLabel: ({ focused, color }) => (
                        focused ? null : <Text style={{ color, fontSize: 11, fontWeight: '600', marginTop: 2 }}>Search</Text>
                    ),
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'Favorites',
                    tabBarIcon: ({ color, size }) => <Heart size={24} color={color} />,
                    href: isAuthenticated ? undefined : null,
                }}
            />
            <Tabs.Screen
                name="bookings"
                options={{
                    title: 'Bookings',
                    tabBarIcon: ({ color, size }) => <Calendar size={24} color={color} />,
                    href: isAuthenticated ? undefined : null,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: isAuthenticated ? 'Profile' : 'Login',
                    tabBarIcon: ({ color, size }) =>
                        isAuthenticated
                            ? <User size={24} color={color} />
                            : <LogIn size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="contact"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
