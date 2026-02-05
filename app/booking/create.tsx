import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ChevronLeft,
    Calendar,
    User,
    Phone,
    Mail,
    AlertCircle,
    CreditCard,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Button, Input, Loading } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchMessById } from '../../store/slices/messSlice';
import { createBooking } from '../../store/slices/bookingSlice';
import bookingService from '../../services/bookingService';
import { Colors } from '../../constants';

export default function CreateBookingScreen() {
    const { messId } = useLocalSearchParams<{ messId: string }>();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { currentMess, isLoading: messLoading } = useAppSelector((state) => state.mess);
    const { isLoading: bookingLoading } = useAppSelector((state) => state.booking);
    const { user } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        tenantName: user?.name || '',
        tenantPhone: user?.phone || '',
        tenantEmail: user?.email || '',
        checkInDate: '',
        emergencyName: '',
        emergencyPhone: '',
        emergencyRelation: '',
        paymentMethod: 'sslcommerz' as 'sslcommerz' | 'cash',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (messId) {
            dispatch(fetchMessById(messId));
        }
    }, [messId]);

    const updateFormData = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => ({ ...prev, [key]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.tenantName.trim()) newErrors.tenantName = 'Name is required';
        if (!formData.tenantPhone.trim()) newErrors.tenantPhone = 'Phone is required';
        if (!formData.tenantEmail.trim()) {
            newErrors.tenantEmail = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.tenantEmail)) {
            newErrors.tenantEmail = 'Invalid email format';
        }
        if (!formData.checkInDate.trim()) newErrors.checkInDate = 'Check-in date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateTotal = () => {
        if (!currentMess) return 0;
        return currentMess.payPerMonth * (currentMess.advancePaymentMonth || 1);
    };

    const handleSubmit = async () => {
        if (!validate() || !currentMess) return;

        try {
            const bookingData = {
                mess_id: messId!,
                checkInDate: formData.checkInDate,
                paymentMethod: formData.paymentMethod,
                tenantName: formData.tenantName,
                tenantPhone: formData.tenantPhone,
                tenantEmail: formData.tenantEmail,
                payAbleAmount: calculateTotal(),
                emergencyContact: formData.emergencyName
                    ? {
                        name: formData.emergencyName,
                        phone: formData.emergencyPhone,
                        relation: formData.emergencyRelation,
                    }
                    : undefined,
            };

            const result = await dispatch(createBooking(bookingData)).unwrap();

            if (formData.paymentMethod === 'sslcommerz') {
                // Initiate payment
                const paymentResponse = await bookingService.initiatePayment(result._id, {
                    name: formData.tenantName,
                    email: formData.tenantEmail,
                    phone: formData.tenantPhone,
                    address: currentMess.address,
                    city: 'Dhaka',
                    postcode: '1000',
                });

                if (paymentResponse.success) {
                    router.replace({
                        pathname: '/payment',
                        params: {
                            paymentUrl: paymentResponse.data.paymentUrl,
                            bookingId: result._id,
                        },
                    });
                }
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'Booking Created',
                    text2: 'Your booking has been submitted for review',
                });
                router.replace(`/booking/${result._id}`);
            }
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Booking Failed',
                text2: err || 'Please try again',
            });
        }
    };

    if (messLoading || !currentMess) {
        return <Loading fullScreen text="Loading..." />;
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Book Mess',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ChevronLeft size={24} color={Colors.gray[800]} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-gray-50"
            >
                <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
                    {/* Mess Preview */}
                    <View className="bg-white p-4 flex-row items-center">
                        <Image
                            source={{ uri: currentMess.image[0]?.url }}
                            className="w-20 h-20 rounded-xl"
                            resizeMode="cover"
                        />
                        <View className="flex-1 ml-4">
                            <Text className="text-gray-800 font-semibold" numberOfLines={1}>
                                {currentMess.title}
                            </Text>
                            <Text className="text-gray-500 text-sm" numberOfLines={1}>
                                {currentMess.address}
                            </Text>
                            <Text className="text-primary-600 font-bold mt-1">
                                ৳{currentMess.payPerMonth?.toLocaleString()}/month
                            </Text>
                        </View>
                    </View>

                    <View className="p-4">
                        {/* Tenant Information */}
                        <View className="bg-white rounded-2xl p-4 mb-4">
                            <Text className="text-gray-800 font-semibold text-lg mb-4">
                                Tenant Information
                            </Text>

                            <Input
                                label="Full Name"
                                placeholder="Enter your full name"
                                value={formData.tenantName}
                                onChangeText={(v) => updateFormData('tenantName', v)}
                                error={errors.tenantName}
                                icon={<User size={18} color={Colors.gray[400]} />}
                            />

                            <Input
                                label="Phone Number"
                                placeholder="01XXXXXXXXX"
                                value={formData.tenantPhone}
                                onChangeText={(v) => updateFormData('tenantPhone', v)}
                                keyboardType="phone-pad"
                                error={errors.tenantPhone}
                                icon={<Phone size={18} color={Colors.gray[400]} />}
                            />

                            <Input
                                label="Email Address"
                                placeholder="your@email.com"
                                value={formData.tenantEmail}
                                onChangeText={(v) => updateFormData('tenantEmail', v)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                error={errors.tenantEmail}
                                icon={<Mail size={18} color={Colors.gray[400]} />}
                            />

                            <Input
                                label="Check-in Date"
                                placeholder="YYYY-MM-DD"
                                value={formData.checkInDate}
                                onChangeText={(v) => updateFormData('checkInDate', v)}
                                error={errors.checkInDate}
                                icon={<Calendar size={18} color={Colors.gray[400]} />}
                            />
                        </View>

                        {/* Emergency Contact */}
                        <View className="bg-white rounded-2xl p-4 mb-4">
                            <Text className="text-gray-800 font-semibold text-lg mb-2">
                                Emergency Contact
                            </Text>
                            <Text className="text-gray-500 text-sm mb-4">Optional but recommended</Text>

                            <Input
                                label="Contact Name"
                                placeholder="Emergency contact name"
                                value={formData.emergencyName}
                                onChangeText={(v) => updateFormData('emergencyName', v)}
                            />

                            <Input
                                label="Contact Phone"
                                placeholder="01XXXXXXXXX"
                                value={formData.emergencyPhone}
                                onChangeText={(v) => updateFormData('emergencyPhone', v)}
                                keyboardType="phone-pad"
                            />

                            <Input
                                label="Relationship"
                                placeholder="e.g., Father, Sister"
                                value={formData.emergencyRelation}
                                onChangeText={(v) => updateFormData('emergencyRelation', v)}
                            />
                        </View>

                        {/* Payment Method */}
                        <View className="bg-white rounded-2xl p-4 mb-4">
                            <Text className="text-gray-800 font-semibold text-lg mb-4">
                                Payment Method
                            </Text>

                            <TouchableOpacity
                                onPress={() => updateFormData('paymentMethod', 'sslcommerz')}
                                className={`flex-row items-center p-4 rounded-xl border-2 mb-3 ${formData.paymentMethod === 'sslcommerz'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200'
                                    }`}
                            >
                                <CreditCard
                                    size={24}
                                    color={
                                        formData.paymentMethod === 'sslcommerz'
                                            ? Colors.primary[500]
                                            : Colors.gray[500]
                                    }
                                />
                                <View className="ml-3 flex-1">
                                    <Text className="text-gray-800 font-medium">SSLCommerz</Text>
                                    <Text className="text-gray-500 text-sm">
                                        Pay online with card, mobile banking
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => updateFormData('paymentMethod', 'cash')}
                                className={`flex-row items-center p-4 rounded-xl border-2 ${formData.paymentMethod === 'cash'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200'
                                    }`}
                            >
                                <Text className="text-2xl">💵</Text>
                                <View className="ml-3 flex-1">
                                    <Text className="text-gray-800 font-medium">Cash on Visit</Text>
                                    <Text className="text-gray-500 text-sm">Pay when you visit the mess</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Price Summary */}
                        <View className="bg-white rounded-2xl p-4 mb-6">
                            <Text className="text-gray-800 font-semibold text-lg mb-4">
                                Price Summary
                            </Text>

                            <View className="flex-row justify-between mb-2">
                                <Text className="text-gray-600">Monthly Rent</Text>
                                <Text className="text-gray-800">
                                    ৳{currentMess.payPerMonth?.toLocaleString()}
                                </Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-gray-600">Advance Months</Text>
                                <Text className="text-gray-800">× {currentMess.advancePaymentMonth || 1}</Text>
                            </View>
                            <View className="h-px bg-gray-200 my-3" />
                            <View className="flex-row justify-between">
                                <Text className="text-gray-800 font-bold text-lg">Total</Text>
                                <Text className="text-primary-600 font-bold text-lg">
                                    ৳{calculateTotal().toLocaleString()}
                                </Text>
                            </View>
                        </View>

                        {/* Note */}
                        <View className="flex-row items-start bg-amber-50 rounded-xl p-4 mb-6">
                            <AlertCircle size={20} color={Colors.accent[600]} />
                            <Text className="flex-1 text-amber-700 text-sm ml-2">
                                By booking, you agree to visit the mess within the scheduled time and
                                respect the owner's rules and regulations.
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Button */}
                <SafeAreaView
                    edges={['bottom']}
                    className="bg-white border-t border-gray-100 px-4 py-4"
                >
                    <Button
                        title={formData.paymentMethod === 'sslcommerz' ? 'Proceed to Payment' : 'Confirm Booking'}
                        onPress={handleSubmit}
                        loading={bookingLoading}
                        fullWidth
                        size="lg"
                    />
                </SafeAreaView>
            </KeyboardAvoidingView>
        </>
    );
}
