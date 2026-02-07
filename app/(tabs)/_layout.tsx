import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Search, Heart, Calendar, User, LogIn } from 'lucide-react-native';
import { Colors } from '../../constants';
import { useAppSelector } from '../../hooks/useRedux';

export default function TabLayout() {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary[500],
                tabBarInactiveTintColor: Colors.gray[400],
                tabBarStyle: {
                    backgroundColor: Colors.white,
                    borderTopWidth: 1,
                    borderTopColor: Colors.gray[100],
                    paddingTop: 8,
                    paddingBottom: 8,
                    height: 64,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 4,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'Favorites',
                    tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
                    href: isAuthenticated ? undefined : null, // Hide when not authenticated
                }}
            />
            <Tabs.Screen
                name="bookings"
                options={{
                    title: 'Bookings',
                    tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
                    href: isAuthenticated ? undefined : null, // Hide when not authenticated
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: isAuthenticated ? 'Profile' : 'Login',
                    tabBarIcon: ({ color, size }) =>
                        isAuthenticated
                            ? <User size={size} color={color} />
                            : <LogIn size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="contact"
                options={{
                    href: null, // Hide from tab bar
                }}
            />
        </Tabs>
    );
}
