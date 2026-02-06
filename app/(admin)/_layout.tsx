import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, Home, Users, Building2, CreditCard, Calendar } from 'lucide-react-native';
import { Colors } from '../../constants';

export default function AdminLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: Colors.primary[600],
                tabBarInactiveTintColor: Colors.gray[400],
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: Colors.gray[200],
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
                    headerTitle: 'Admin Dashboard',
                }}
            />
            <Tabs.Screen
                name="homepage"
                options={{
                    title: 'Homepage',
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                    headerTitle: 'Homepage Management',
                }}
            />
            <Tabs.Screen
                name="messes"
                options={{
                    title: 'Messes',
                    tabBarIcon: ({ color, size }) => <Building2 size={size} color={color} />,
                    headerTitle: 'Mess Listings',
                }}
            />
            <Tabs.Screen
                name="students"
                options={{
                    title: 'Students',
                    tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
                    headerTitle: 'Student Activity',
                }}
            />
            <Tabs.Screen
                name="owners"
                options={{
                    title: 'Owners',
                    tabBarIcon: ({ color, size }) => <Building2 size={size} color={color} />,
                    headerTitle: 'Owner Activity',
                }}
            />
            <Tabs.Screen
                name="payments"
                options={{
                    title: 'Payments',
                    tabBarIcon: ({ color, size }) => <CreditCard size={size} color={color} />,
                    headerTitle: 'Payment History',
                }}
            />
            <Tabs.Screen
                name="bookings-admin"
                options={{
                    title: 'Bookings',
                    tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
                    headerTitle: 'Booking Dashboard',
                }}
            />
        </Tabs>
    );
}
