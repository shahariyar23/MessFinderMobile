import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, Phone, Building, GraduationCap } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import Toast from 'react-native-toast-message';
import { Button, Input } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { register, clearError } from '../../store/slices/authSlice';
import { Colors } from '../../constants';

export default function RegisterScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector((state) => state.auth);
    const { colorScheme } = useColorScheme();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'student' as 'student' | 'owner',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^01[3-9]\d{8}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid Bangladesh phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        dispatch(clearError());

        try {
            await dispatch(register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: formData.role,
            })).unwrap();

            Toast.show({
                type: 'success',
                text1: 'Registration Successful',
                text2: 'Please login with your credentials',
            });
            router.replace('/(auth)/login');
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: err || 'Please try again',
            });
        }
    };

    const updateFormData = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => ({ ...prev, [key]: '' }));
        }
    };

    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: colorScheme === 'dark' ? '#111827' : '#ffffff' }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 px-6 pt-6 pb-6">
                        {/* Header */}
                        <View className="items-center mb-8">
                            <View className="w-16 h-16 bg-primary-500 rounded-2xl items-center justify-center mb-3">
                                <Text className="text-white text-2xl font-bold">MF</Text>
                            </View>
                            <Text className="text-2xl font-bold text-gray-800 dark:text-white">Create Account</Text>
                            <Text className="text-gray-500 dark:text-gray-400 mt-1 text-center">
                                Join Mess Finder to find your ideal accommodation
                            </Text>
                        </View>

                        {/* Role Selection */}
                        <View className="mb-5">
                            <Text className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">I am a</Text>
                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    onPress={() => updateFormData('role', 'student')}
                                    className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border-2 ${formData.role === 'student'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                                        }`}
                                >
                                    <GraduationCap
                                        size={20}
                                        color={formData.role === 'student' ? Colors.primary[500] : Colors.gray[500]}
                                    />
                                    <Text
                                        className={`ml-2 font-medium ${formData.role === 'student' ? 'text-primary-600' : 'text-gray-600 dark:text-gray-300'
                                            }`}
                                    >
                                        Student
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => updateFormData('role', 'owner')}
                                    className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border-2 ${formData.role === 'owner'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                                        }`}
                                >
                                    <Building
                                        size={20}
                                        color={formData.role === 'owner' ? Colors.primary[500] : Colors.gray[500]}
                                    />
                                    <Text
                                        className={`ml-2 font-medium ${formData.role === 'owner' ? 'text-primary-600' : 'text-gray-600 dark:text-gray-300'
                                            }`}
                                    >
                                        Mess Owner
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Form */}
                        <View className="mb-4">
                            <Input
                                label="Full Name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChangeText={(v) => updateFormData('name', v)}
                                error={errors.name}
                                icon={<User size={20} color={Colors.gray[400]} />}
                            />

                            <Input
                                label="Email Address"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChangeText={(v) => updateFormData('email', v)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                error={errors.email}
                                icon={<Mail size={20} color={Colors.gray[400]} />}
                            />

                            <Input
                                label="Phone Number"
                                placeholder="01XXXXXXXXX"
                                value={formData.phone}
                                onChangeText={(v) => updateFormData('phone', v)}
                                keyboardType="phone-pad"
                                error={errors.phone}
                                icon={<Phone size={20} color={Colors.gray[400]} />}
                            />

                            <Input
                                label="Password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChangeText={(v) => updateFormData('password', v)}
                                secureTextEntry
                                error={errors.password}
                                icon={<Lock size={20} color={Colors.gray[400]} />}
                            />

                            <Input
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChangeText={(v) => updateFormData('confirmPassword', v)}
                                secureTextEntry
                                error={errors.confirmPassword}
                                icon={<Lock size={20} color={Colors.gray[400]} />}
                            />

                            <Button
                                title="Create Account"
                                onPress={handleRegister}
                                loading={isLoading}
                                fullWidth
                                size="lg"
                            />
                        </View>

                        {/* Login Link */}
                        <View className="flex-row justify-center mt-4">
                            <Text className="text-gray-600 dark:text-gray-400">Already have an account? </Text>
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text className="text-primary-600 font-semibold">Sign In</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
