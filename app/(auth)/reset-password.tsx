import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, Eye, EyeOff } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Colors } from '../../constants';
import { Button, Input } from '../../components/ui';
import { useAppDispatch } from '../../hooks/useRedux';
import { resetPassword } from '../../store/slices/authSlice';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const params = useLocalSearchParams();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const email = params.email as string;
    const code = params.code as string;

    const handleResetPassword = async () => {
        // Validation
        if (!newPassword.trim() || !confirmPassword.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Missing Information',
                text2: 'Please fill in all fields',
            });
            return;
        }

        if (newPassword.length < 6) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Password',
                text2: 'Password must be at least 6 characters',
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Password Mismatch',
                text2: 'Passwords do not match',
            });
            return;
        }

        setLoading(true);
        try {
            const result = await dispatch(resetPassword({ email, code, newPassword })).unwrap();

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Password reset successfully',
            });

            setTimeout(() => {
                router.replace('/(auth)/login');
            }, 1500);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Reset Failed',
                text2: error || 'Failed to reset password',
            });
        } finally {
            setLoading(false);
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
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 px-6 py-8">
                        {/* Header */}
                        <View className="mb-8">
                            <View className="w-16 h-16 bg-primary-100 rounded-2xl items-center justify-center mb-5">
                                <Lock size={32} color={Colors.primary[600]} />
                            </View>
                            <Text className="text-3xl font-bold text-gray-800">Reset Password</Text>
                            <Text className="text-gray-500 mt-2">
                                Enter your new password
                            </Text>
                        </View>

                        {/* New Password */}
                        <View className="mb-5">
                            <Text className="text-gray-700 font-medium mb-2">New Password</Text>
                            <View className="relative">
                                <Input
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    icon={<Lock size={20} color={Colors.gray[400]} />}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} color={Colors.gray[400]} />
                                    ) : (
                                        <Eye size={20} color={Colors.gray[400]} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View className="mb-6">
                            <Text className="text-gray-700 font-medium mb-2">Confirm Password</Text>
                            <View className="relative">
                                <Input
                                    placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                    icon={<Lock size={20} color={Colors.gray[400]} />}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-3.5"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} color={Colors.gray[400]} />
                                    ) : (
                                        <Eye size={20} color={Colors.gray[400]} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Reset Button */}
                        <Button
                            title="Reset Password"
                            onPress={handleResetPassword}
                            loading={loading}
                            disabled={loading}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
