import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Button, Input } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { login, clearError } from '../../store/slices/authSlice';
import { Colors } from '../../constants';

export default function LoginScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        dispatch(clearError());

        try {
            const result = await dispatch(login({ email, password })).unwrap();
            console.log(result, "login result");
            Toast.show({
                type: 'success',
                text1: 'OTP Sent',
                text2: 'Please check your email for the verification code',
            });
            router.push({
                pathname: '/(auth)/verify-otp',
                params: { email },
            });
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: err || 'Please check your credentials and try again',
            });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 px-6 pt-8 pb-6">
                        {/* Logo & Header */}
                        <View className="items-center mb-10">
                            <View className="w-20 h-20 bg-primary-500 rounded-3xl items-center justify-center mb-4 shadow-lg">
                                <Text className="text-white text-3xl font-bold">MF</Text>
                            </View>
                            <Text className="text-3xl font-bold text-gray-800">Welcome Back</Text>
                            <Text className="text-gray-500 mt-2 text-center">
                                Sign in to find your perfect mess accommodation
                            </Text>
                        </View>

                        {/* Login Form */}
                        <View className="mb-6">
                            <Input
                                label="Email Address"
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                error={errors.email}
                                icon={<Mail size={20} color={Colors.gray[400]} />}
                            />

                            <Input
                                label="Password"
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                error={errors.password}
                                icon={<Lock size={20} color={Colors.gray[400]} />}
                            />

                            <TouchableOpacity
                                onPress={() => router.push('/(auth)/forgot-password')}
                                className="self-end mb-6"
                            >
                                <Text className="text-primary-600 font-medium">Forgot Password?</Text>
                            </TouchableOpacity>

                            <Button
                                title="Sign In"
                                onPress={handleLogin}
                                loading={isLoading}
                                fullWidth
                                size="lg"
                            />
                        </View>

                        {/* Divider */}
                        <View className="flex-row items-center my-6">
                            <View className="flex-1 h-px bg-gray-200" />
                            <Text className="mx-4 text-gray-500">or</Text>
                            <View className="flex-1 h-px bg-gray-200" />
                        </View>

                        {/* Register Link */}
                        <View className="flex-row justify-center">
                            <Text className="text-gray-600">Don't have an account? </Text>
                            <Link href="/(auth)/register" asChild>
                                <TouchableOpacity>
                                    <Text className="text-primary-600 font-semibold">Sign Up</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
