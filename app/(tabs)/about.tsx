import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, Users, Shield, Zap } from 'lucide-react-native';
import { Colors } from '../../constants';

export default function AboutScreen() {
    const features = [
        {
            icon: Target,
            title: 'Our Mission',
            description: 'Connecting students with quality mess and hostel services across Bangladesh',
        },
        {
            icon: Users,
            title: 'Community Driven',
            description: 'Built by students, for students, with verified mess listings and reviews',
        },
        {
            icon: Shield,
            title: 'Secure & Trusted',
            description: 'All listings verified and payments processed securely',
        },
        {
            icon: Zap,
            title: 'Easy Booking',
            description: 'Find, compare, and book your ideal mess in just a few taps',
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View className="bg-primary-600 px-6 py-12">
                    <Text className="text-3xl font-bold text-white mb-3">About MessFinder</Text>
                    <Text className="text-primary-100 text-base leading-6">
                        Your trusted platform for finding and booking mess accommodations
                    </Text>
                </View>

                {/* Mission Statement */}
                <View className="px-6 py-8 bg-white">
                    <Text className="text-2xl font-bold text-gray-800 mb-4">Who We Are</Text>
                    <Text className="text-gray-600 leading-6 mb-4">
                        MessFinder is a comprehensive platform designed to simplify the mess hunting process
                        for students. We connect students with quality mess and hostel dining services,
                        making it easier than ever to find the perfect accommodation.
                    </Text>
                    <Text className="text-gray-600 leading-6">
                        Founded with the mission to solve the accommodation challenges faced by students,
                        we've grown into a trusted community where students can discover, compare, and book
                        mess services with confidence.
                    </Text>
                </View>

                {/* Features */}
                <View className="px-6 py-8">
                    <Text className="text-2xl font-bold text-gray-800 mb-6">Why Choose Us</Text>
                    <View className="space-y-4">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <View key={index} className="bg-white rounded-2xl p-5 shadow-sm">
                                    <View className="flex-row items-start">
                                        <View className="w-12 h-12 bg-primary-100 rounded-xl items-center justify-center mr-4">
                                            <Icon size={24} color={Colors.primary[600]} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-lg font-bold text-gray-800 mb-1">
                                                {feature.title}
                                            </Text>
                                            <Text className="text-gray-600 leading-5">
                                                {feature.description}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Stats */}
                <View className="px-6 py-8 bg-white">
                    <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Our Impact
                    </Text>
                    <View className="flex-row flex-wrap -mx-2">
                        {[
                            { label: 'Active Messes', value: '120+' },
                            { label: 'Happy Students', value: '1,250+' },
                            { label: 'Cities Served', value: '15+' },
                            { label: 'Bookings Made', value: '3,400+' },
                        ].map((stat, index) => (
                            <View key={index} className="w-1/2 px-2 mb-4">
                                <View className="bg-primary-50 rounded-2xl p-4 items-center">
                                    <Text className="text-3xl font-bold text-primary-600 mb-1">
                                        {stat.value}
                                    </Text>
                                    <Text className="text-sm text-primary-700 text-center">
                                        {stat.label}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Contact */}
                <View className="px-6 py-8">
                    <View className="bg-primary-600 rounded-2xl p-6">
                        <Text className="text-xl font-bold text-white mb-2">Get in Touch</Text>
                        <Text className="text-primary-100 mb-4">
                            Have questions? We're here to help!
                        </Text>
                        <Text className="text-white">Email: support@messfinder.com</Text>
                        <Text className="text-white mt-1">Phone: +880 1xxx-xxxxxx</Text>
                    </View>
                </View>

                <View className="h-6" />
            </ScrollView>
        </SafeAreaView>
    );
}
