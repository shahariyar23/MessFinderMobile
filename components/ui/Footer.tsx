import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import {
    Facebook,
    Twitter,
    Instagram,
    Mail,
    Phone,
    MapPin,
    Heart,
    Home,
} from 'lucide-react-native';
import { Colors } from '../../constants';

export const Footer = () => {
    const router = useRouter();

    const socialLinks = [
        { icon: Facebook, url: 'https://facebook.com', color: '#1877F2' },
        { icon: Twitter, url: 'https://twitter.com', color: '#1DA1F2' },
        { icon: Instagram, url: 'https://instagram.com', color: '#E4405F' },
    ];

    const quickLinks = [
        { label: 'About Us', path: '/about' },
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Contact Support', path: '/contact' },
    ];

    return (
        <View className="relative">
            {/* Separator */}
            <View className="h-[1px] bg-gray-200 w-[90%] mx-auto mb-6" />

            <View className="bg-gray-50 pt-10 pb-20 px-6 rounded-t-3xl shadow-sm">
                {/* Brand Section */}
                <View className="items-center mb-8">
                    {/* Logo & Title Lockup */}
                    <View className="flex-row items-center justify-center gap-3 mb-4">
                        <View className="bg-primary-100 p-3 rounded-xl rotate-3 shadow-sm">
                            <Home size={28} color={Colors.primary[600]} />
                        </View>
                        <View>
                            <Text className="text-2xl font-extrabold text-gray-800 leading-none">Mess</Text>
                            <Text className="text-2xl font-extrabold text-primary-600 leading-none">Finder</Text>
                        </View>
                    </View>

                    <Text className="text-gray-500 text-center text-sm leading-6 max-w-xs px-4">
                        Your trusted companion for finding the perfect mess accommodation.
                        {'\n'}
                        Simple, fast, and reliable.
                    </Text>
                </View>

                {/* Quick Links Grid */}
                <View className="flex-row flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
                    {quickLinks.map((link, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                // Linking or Router navigation depending on implementation
                                // router.push(link.path);
                            }}
                        >
                            <Text className="text-gray-600 font-medium text-sm">{link.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Contact Info */}
                <View className="mb-8 space-y-3 items-center">
                    <View className="flex-row items-center gap-2">
                        <MapPin size={16} color={Colors.gray[500]} />
                        <Text className="text-gray-600 text-sm">Dhaka, Bangladesh</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Phone size={16} color={Colors.gray[500]} />
                        <Text className="text-gray-600 text-sm">+880 1234-567890</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Mail size={16} color={Colors.gray[500]} />
                        <Text className="text-gray-600 text-sm">support@messfinder.com</Text>
                    </View>
                </View>

                {/* Social Links */}
                <View className="flex-row justify-center gap-6 mb-8">
                    {socialLinks.map((social, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => Linking.openURL(social.url)}
                            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-gray-100"
                        >
                            <social.icon size={20} color={social.color} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Footer Bottom */}
                <View className="border-t border-gray-200 pt-6 items-center">
                    <Text className="text-gray-400 text-xs mb-2">
                        © {new Date().getFullYear()} MessFinder. All rights reserved.
                    </Text>
                    <View className="flex-row items-center">
                        <Text className="text-gray-400 text-xs">Made with </Text>
                        <Heart size={10} color={Colors.error} fill={Colors.error} />
                        <Text className="text-gray-400 text-xs"> in Bangladesh</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
