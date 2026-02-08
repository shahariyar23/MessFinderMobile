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
import { useColorScheme } from 'nativewind';


export const Footer = () => {
    const router = useRouter();
    const { colorScheme } = useColorScheme();

    const iconColor = colorScheme === 'dark' ? Colors.gray[400] : Colors.gray[600];
    const textColor = colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const bgColor = colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white';
    const borderColor = colorScheme === 'dark' ? 'border-gray-800' : 'border-gray-200';

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
        <View className={`${bgColor} relative mx-4 rounded-t-3xl mt-6`}>
            {/* Separator */}
            <View className={`h-[1px] ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} w-[90%] mx-auto mb-6`} />

            <View className={`${bgColor} pt-6 pb-20 rounded-t-3xl shadow-sm`}>
                {/* Brand Section */}
                <View className="items-center mb-8">
                    {/* Logo & Title Lockup */}
                    <View className="flex-row items-center justify-center gap-3 mb-4">
                        <View className={`p-3 rounded-xl rotate-3 shadow-sm ${colorScheme === 'dark' ? 'bg-primary-900/30' : 'bg-primary-100'}`}>
                            <Home size={28} color={Colors.primary[600]} />
                        </View>
                        <View>
                            <Text className={`text-2xl font-extrabold ${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'} leading-none`}>Mess</Text>
                            <Text className="text-2xl font-extrabold text-primary-600 leading-none">Finder</Text>
                        </View>
                    </View>

                    <Text className={`${textColor} text-center text-sm leading-6 max-w-xs px-4`}>
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
                            <Text className={`${textColor} font-medium text-sm`}>{link.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Contact Info */}
                <View className="mb-8 space-y-3 items-center">
                    <View className="flex-row items-center gap-2">
                        <MapPin size={16} color={iconColor} />
                        <Text className={`${textColor} text-sm`}>Dhaka, Bangladesh</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Phone size={16} color={iconColor} />
                        <Text className={`${textColor} text-sm`}>+880 1234-567890</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Mail size={16} color={iconColor} />
                        <Text className={`${textColor} text-sm`}>support@messfinder.com</Text>
                    </View>
                </View>

                {/* Social Links */}
                <View className="flex-row justify-center gap-6 mb-8">
                    {socialLinks.map((social, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => Linking.openURL(social.url)}
                            className={`w-10 h-10 ${colorScheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-full items-center justify-center shadow-sm border`}
                        >
                            <social.icon size={20} color={social.color} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Footer Bottom */}
                <View className={`border-t ${borderColor} pt-6 items-center`}>
                    <Text className="text-gray-400 text-xs text-center mb-2">
                        © {new Date().getFullYear()} MessFinder. All rights reserved.
                    </Text>
                    <View className="flex-row items-center">
                        <Text className="text-gray-400 text-xs">Made with </Text>
                        <Heart size={12} color={Colors.error} fill={Colors.error} style={{ marginHorizontal: 4 }} />
                        <Text className="text-gray-400 text-xs"> in Bangladesh</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
