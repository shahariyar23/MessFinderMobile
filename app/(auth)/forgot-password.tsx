import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Lock, KeyRound } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import Toast from 'react-native-toast-message';
import { Button, Input } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { forgotPassword, resetPassword, clearError } from '../../store/slices/authSlice';
import { Colors } from '../../constants';

type Step = 'email' | 'code' | 'password';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector((state) => state.auth);
    const { colorScheme } = useColorScheme();

    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSendCode = async () => {
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setErrors({ email: 'Please enter a valid email' });
            return;
        }

        dispatch(clearError());

        try {
            await dispatch(forgotPassword(email)).unwrap();
            Toast.show({
                type: 'success',
                text1: 'Code Sent',
                text2: 'Check your email for the reset code',
            });
            setStep('code');
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Failed',
                text2: err || 'Could not send reset code',
            });
        }
    };

    const handleVerifyCode = () => {
        if (!code.trim() || code.length !== 6) {
            setErrors({ code: 'Please enter the 6-digit code' });
            return;
        }
        setStep('password');
    };

    const handleResetPassword = async () => {
        const newErrors: Record<string, string> = {};

        if (!newPassword || newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        dispatch(clearError());

        try {
            await dispatch(resetPassword({ email, code, newPassword })).unwrap();
            Toast.show({
                type: 'success',
                text1: 'Password Reset',
                text2: 'You can now login with your new password',
            });
            router.replace('/(auth)/login');
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Reset Failed',
                text2: err || 'Could not reset password',
            });
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 'email':
                return (
                    <>
                        <View className="items-center mb-8">
                            <View className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full items-center justify-center mb-4">
                                <Mail size={32} color={Colors.primary[500]} />
                            </View>
                            <Text className="text-2xl font-bold text-gray-800 dark:text-white">Forgot Password?</Text>
                            <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                                Enter your email and we'll send you a reset code
                            </Text>
                        </View>
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
                        <Button
                            title="Send Reset Code"
                            onPress={handleSendCode}
                            loading={isLoading}
                            fullWidth
                            size="lg"
                        />
                    </>
                );

            case 'code':
                return (
                    <>
                        <View className="items-center mb-8">
                            <View className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full items-center justify-center mb-4">
                                <KeyRound size={32} color={Colors.primary[500]} />
                            </View>
                            <Text className="text-2xl font-bold text-gray-800 dark:text-white">Enter Code</Text>
                            <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                                We sent a 6-digit code to {email}
                            </Text>
                        </View>
                        <Input
                            label="Reset Code"
                            placeholder="Enter 6-digit code"
                            value={code}
                            onChangeText={setCode}
                            keyboardType="number-pad"
                            error={errors.code}
                            icon={<KeyRound size={20} color={Colors.gray[400]} />}
                        />
                        <Button
                            title="Verify Code"
                            onPress={handleVerifyCode}
                            fullWidth
                            size="lg"
                        />
                    </>
                );

            case 'password':
                return (
                    <>
                        <View className="items-center mb-8">
                            <View className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full items-center justify-center mb-4">
                                <Lock size={32} color={Colors.primary[500]} />
                            </View>
                            <Text className="text-2xl font-bold text-gray-800 dark:text-white">New Password</Text>
                            <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                                Create a strong new password
                            </Text>
                        </View>
                        <Input
                            label="New Password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            error={errors.newPassword}
                            icon={<Lock size={20} color={Colors.gray[400]} />}
                        />
                        <Input
                            label="Confirm Password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            error={errors.confirmPassword}
                            icon={<Lock size={20} color={Colors.gray[400]} />}
                        />
                        <Button
                            title="Reset Password"
                            onPress={handleResetPassword}
                            loading={isLoading}
                            fullWidth
                            size="lg"
                        />
                    </>
                );
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
                    <View className="flex-1 px-6 pt-4">
                        {/* Back Button */}
                        <TouchableOpacity
                            onPress={() => {
                                if (step === 'email') {
                                    router.back();
                                } else if (step === 'code') {
                                    setStep('email');
                                } else {
                                    setStep('code');
                                }
                            }}
                            className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mb-6"
                        >
                            <ArrowLeft size={20} color={Colors.gray[700]} />
                        </TouchableOpacity>

                        {/* Step Indicator */}
                        <View className="flex-row justify-center mb-6">
                            {['email', 'code', 'password'].map((s, i) => (
                                <View
                                    key={s}
                                    className={`w-8 h-1 mx-1 rounded-full ${i <= ['email', 'code', 'password'].indexOf(step)
                                        ? 'bg-primary-500'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                />
                            ))}
                        </View>

                        {renderStepContent()}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
