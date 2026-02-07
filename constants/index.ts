// API Configuration
export const API_BASE_URL = 'http://192.168.0.104:8000/api/v1';

// App Colors
export const Colors = {
    primary: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
    },
    secondary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
    },
    accent: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
    },
    gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
    },
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    textMuted: '#64748b',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    white: '#ffffff',
    black: '#000000',
};

// Facility Icons Mapping
export const FacilityIcons: Record<string, string> = {
    'Wi-Fi': 'wifi',
    'Meals': 'utensils',
    'Laundry': 'shirt',
    'Lifts': 'arrow-up-down',
    'Parking': 'car',
    'Security': 'shield',
    'Generator': 'zap',
    'Gym': 'dumbbell',
    'AC': 'snowflake',
    'Cleaning': 'sparkles',
    'Water': 'droplets',
    'Gas': 'flame',
};

// Room Types
export const RoomTypes = ['Single', 'Shared', 'Double', 'Triple', 'Dormitory'];

// Gender Preferences
export const GenderPreferences = ['Male', 'Female', 'Any'];

// Booking Status Colors
export const BookingStatusColors: Record<string, string> = {
    pending: '#f59e0b',
    confirmed: '#22c55e',
    cancelled: '#ef4444',
    rejected: '#ef4444',
    completed: '#3b82f6',
};

// Payment Status Colors
export const PaymentStatusColors: Record<string, string> = {
    pending: '#f59e0b',
    paid: '#22c55e',
    failed: '#ef4444',
    refunded: '#8b5cf6',
};

// Storage Keys
export const StorageKeys = {
    AUTH_TOKEN: '@messfinder_auth_token',
    USER_DATA: '@messfinder_user_data',
    ONBOARDING_COMPLETE: '@messfinder_onboarding',
};

// Screen Names
export const Screens = {
    LOGIN: '(auth)/login',
    REGISTER: '(auth)/register',
    VERIFY_OTP: '(auth)/verify-otp',
    FORGOT_PASSWORD: '(auth)/forgot-password',
    HOME: '(tabs)',
    MESS_DETAIL: 'mess/[id]',
    BOOKING_DETAIL: 'booking/[id]',
    CREATE_BOOKING: 'booking/create',
    PAYMENT: 'payment',
};
