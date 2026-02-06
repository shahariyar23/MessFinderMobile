import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Colors } from '../../constants';
import { Button } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { verifyOTP } from '../../store/slices/authSlice';

export default function VerifyLoginOTPScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { otpEmail, isLoading } = useAppSelector((state: any) => state.auth);

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleOtpChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return; // Only digits

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits entered
        if (index === 5 && value && newOtp.every((digit) => digit)) {
            handleVerifyOTP(newOtp.join(''));
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOTP = async (otpCode?: string) => {
        const otpValue = otpCode || otp.join('');

        if (otpValue.length !== 6) {
            Toast.show({
                type: 'error',
                text1: 'Invalid OTP',
                text2: 'Please enter all 6 digits',
            });
            return;
        }

        try {
            await dispatch(verifyOTP({ email: otpEmail!, otp: otpValue })).unwrap();

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Login successful',
            });

            // Navigation handled automatically by _layout.tsx role-based redirect
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Verification Failed',
                text2: error || 'Invalid OTP code',
            });
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    };

    const handleResendOTP = async () => {
        // TODO: Implement resend OTP API call
        Toast.show({
            type: 'info',
            text1: 'OTP Sent',
            text2: 'A new OTP has been sent to your email',
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1 px-6 py-8">
                    {/* Header */}
                    <View className="mb-8">
                        <View className="w-16 h-16 bg-primary-100 rounded-2xl items-center justify-center mb-5">
                            <ShieldCheck size={32} color={Colors.primary[600]} />
                        </View>
                        <Text className="text-3xl font-bold text-gray-800">Verify Login</Text>
                        <Text className="text-gray-500 mt-2">
                            We've sent a verification code to{'\n'}
                            <Text className="font-medium text-gray-700">{otpEmail}</Text>
                        </Text>
                    </View>

                    {/* OTP Input */}
                    <View className="mb-8">
                        <Text className="text-gray-700 font-medium mb-4">Enter 6-digit code</Text>
                        <View className="flex-row justify-between">
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => { inputRefs.current[index] = ref; }}
                                    value={digit}
                                    onChangeText={(value) => handleOtpChange(value, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    className="w-12 h-14 bg-gray-100 rounded-xl text-center text-xl font-bold text-gray-800"
                                    style={{ fontSize: 20 }}
                                    selectTextOnFocus
                                />
                            ))}
                        </View>
                    </View>

                    {/* Verify Button */}
                    <Button
                        title="Verify & Continue"
                        onPress={() => handleVerifyOTP()}
                        loading={isLoading}
                        disabled={isLoading || otp.some((digit) => !digit)}
                    />

                    {/* Resend OTP */}
                    <View className="flex-row justify-center mt-6">
                        <Text className="text-gray-500">Didn't receive the code? </Text>
                        <TouchableOpacity onPress={handleResendOTP}>
                            <Text className="text-primary-600 font-semibold">Resend</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
