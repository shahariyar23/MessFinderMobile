import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Colors } from '../../constants';
import { Button } from '../../components/ui';

export default function ContactScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Missing Information',
                text2: 'Please fill in all fields',
            });
            return;
        }

        setLoading(true);
        try {
            // TODO: Replace with actual API call
            // await contactService.sendMessage({ name, email, subject, message });

            Toast.show({
                type: 'success',
                text1: 'Message Sent',
                text2: 'We will get back to you soon!',
            });

            // Clear form
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to send message',
            });
        } finally {
            setLoading(false);
        }
    };

    const openEmail = () => {
        Linking.openURL('mailto:support@messfinder.com');
    };

    const openPhone = () => {
        Linking.openURL('tel:+8801xxxxxxxxx');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="bg-primary-600 px-6 py-12">
                    <Text className="text-3xl font-bold text-white mb-3">Contact Us</Text>
                    <Text className="text-primary-100 text-base">
                        We'd love to hear from you. Send us a message!
                    </Text>
                </View>

                {/* Contact Methods */}
                <View className="px-6 py-8">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Get In Touch</Text>

                    <TouchableOpacity
                        onPress={openEmail}
                        className="bg-white rounded-2xl p-4 mb-3 shadow-sm flex-row items-center"
                    >
                        <View className="w-12 h-12 bg-primary-100 rounded-xl items-center justify-center mr-4">
                            <Mail size={24} color={Colors.primary[600]} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm text-gray-500">Email</Text>
                            <Text className="text-gray-800 font-medium">support@messfinder.com</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={openPhone}
                        className="bg-white rounded-2xl p-4 mb-3 shadow-sm flex-row items-center"
                    >
                        <View className="w-12 h-12 bg-secondary-100 rounded-xl items-center justify-center mr-4">
                            <Phone size={24} color={Colors.secondary[600]} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm text-gray-500">Phone</Text>
                            <Text className="text-gray-800 font-medium">+880 1xxx-xxxxxx</Text>
                        </View>
                    </TouchableOpacity>

                    <View className="bg-white rounded-2xl p-4 shadow-sm flex-row items-center">
                        <View className="w-12 h-12 bg-accent-100 rounded-xl items-center justify-center mr-4">
                            <MapPin size={24} color={Colors.accent[600]} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm text-gray-500">Address</Text>
                            <Text className="text-gray-800 font-medium">Dhaka, Bangladesh</Text>
                        </View>
                    </View>
                </View>

                {/* Contact Form */}
                <View className="px-6 pb-8">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Send a Message</Text>

                    <View className="bg-white rounded-2xl p-5 shadow-sm">
                        <View className="mb-4">
                            <Text className="text-gray-700 font-medium mb-2">Name</Text>
                            <TextInput
                                placeholder="Your name"
                                value={name}
                                onChangeText={setName}
                                className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800"
                                placeholderTextColor={Colors.gray[400]}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-700 font-medium mb-2">Email</Text>
                            <TextInput
                                placeholder="your.email@example.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800"
                                placeholderTextColor={Colors.gray[400]}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-700 font-medium mb-2">Subject</Text>
                            <TextInput
                                placeholder="What's this about?"
                                value={subject}
                                onChangeText={setSubject}
                                className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800"
                                placeholderTextColor={Colors.gray[400]}
                            />
                        </View>

                        <View className="mb-5">
                            <Text className="text-gray-700 font-medium mb-2">Message</Text>
                            <TextInput
                                placeholder="Your message..."
                                value={message}
                                onChangeText={setMessage}
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800"
                                placeholderTextColor={Colors.gray[400]}
                            />
                        </View>

                        <Button
                            title="Send Message"
                            onPress={handleSubmit}
                            loading={loading}
                            leftIcon={<Send size={18} color="#fff" />}
                        />
                    </View>
                </View>

                {/* FAQ Hint */}
                <View className="px-6 pb-8">
                    <View className="bg-primary-50 rounded-2xl p-6">
                        <View className="flex-row items-start">
                            <MessageCircle size={24} color={Colors.primary[600]} />
                            <View className="flex-1 ml-3">
                                <Text className="text-primary-900 font-bold mb-1">
                                    Looking for quick answers?
                                </Text>
                                <Text className="text-primary-700">
                                    Check out our FAQ section for common questions about bookings, payments,
                                    and account management.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="h-6" />
            </ScrollView>
        </SafeAreaView>
    );
}
