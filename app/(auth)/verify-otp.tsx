import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Button } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { verifyOTP, login, clearError } from '../../store/slices/authSlice';
import { Colors } from '../../constants';

export default function VerifyOTPScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector((state) => state.auth);

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resendTimer, setResendTimer] = useState(60);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleOtpChange = (value: string, index: number) => {
        if (value.length > 1) {
            // Handle paste
            const otpArray = value.split('').slice(0, 6);
            setOtp(otpArray.concat(Array(6 - otpArray.length).fill('')));
            inputRefs.current[5]?.focus();
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            Toast.show({
                type: 'error',
                text1: 'Invalid OTP',
                text2: 'Please enter a valid 6-digit code',
            });
            return;
        }

        dispatch(clearError());

        try {
            await dispatch(verifyOTP({ email: email!, otp: otpCode })).unwrap();
            Toast.show({
                type: 'success',
                text1: 'Welcome!',
                text2: 'Login successful',
            });
            router.replace('/(tabs)');
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Verification Failed',
                text2: err || 'Invalid OTP. Please try again.',
            });
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;

        try {
            // Re-trigger login to send new OTP
            await dispatch(login({ email: email!, password: '' })).unwrap();
            setResendTimer(60);
            setOtp(['', '', '', '', '', '']);
            Toast.show({
                type: 'success',
                text1: 'OTP Resent',
                text2: 'A new verification code has been sent',
            });
        } catch (err) {
            // This might fail since we don't have password, but the idea is to request resend
            Toast.show({
                type: 'info',
                text1: 'Resend Request',
                text2: 'Please go back and login again to receive new OTP',
            });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1 px-6 pt-4">
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-6"
                    >
                        <ArrowLeft size={20} color={Colors.gray[700]} />
                    </TouchableOpacity>

                    {/* Header */}
                    <View className="items-center mb-10">
                        <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center mb-4">
                            <Mail size={32} color={Colors.primary[500]} />
                        </View>
                        <Text className="text-2xl font-bold text-gray-800">Verify Your Email</Text>
                        <Text className="text-gray-500 mt-2 text-center">
                            We've sent a 6-digit code to
                        </Text>
                        <Text className="text-primary-600 font-medium">{email}</Text>
                    </View>

                    {/* OTP Input */}
                    <View className="flex-row justify-center gap-3 mb-8">
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                className={`w-12 h-14 border-2 rounded-xl text-center text-xl font-bold ${digit
                                        ? 'border-primary-500 bg-primary-50 text-primary-600'
                                        : 'border-gray-200 bg-gray-50 text-gray-800'
                                    }`}
                                selectionColor={Colors.primary[500]}
                            />
                        ))}
                    </View>

                    {/* Verify Button */}
                    <Button
                        title="Verify & Continue"
                        onPress={handleVerify}
                        loading={isLoading}
                        fullWidth
                        size="lg"
                    />

                    {/* Resend */}
                    <View className="flex-row justify-center items-center mt-6">
                        <Text className="text-gray-500">Didn't receive the code? </Text>
                        {resendTimer > 0 ? (
                            <Text className="text-gray-400">Resend in {resendTimer}s</Text>
                        ) : (
                            <TouchableOpacity onPress={handleResend} className="flex-row items-center">
                                <RefreshCw size={14} color={Colors.primary[500]} />
                                <Text className="text-primary-600 font-medium ml-1">Resend</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
