// User Types
export interface User {
    id: string;
    _id?: string;
    name: string;
    email: string;
    phone: string;
    role: 'student' | 'owner' | 'admin';
    isActive?: boolean;
    createdAt?: string;
}

// Auth Types
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    otpRequired: boolean;
    otpEmail: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'student' | 'owner';
}

export interface OTPVerifyData {
    email: string;
    otp: string;
}

// Mess Types
export interface MessImage {
    url: string;
    public_id: string;
}

export interface MessOwner {
    _id: string;
    name: string;
    email: string;
    phone: string;
}

export interface RatingInfo {
    totalReviews: number;
    detailedRating?: number;
    averageRating?: number;
    ratingDistribution?: Record<string, number>;
}

export interface Mess {
    _id: string;
    title: string;
    description: string;
    address: string;
    status: 'free' | 'pending' | 'booked' | 'in progress';
    availableFrom?: string;
    advancePaymentMonth: number;
    payPerMonth: number;
    facilities: string[];
    roomType: string;
    roomFeatures: string[];
    genderPreference: 'Male' | 'Female' | 'Any';
    contact: string;
    image: MessImage[];
    view: number;
    owner_id: MessOwner | string;
    owner_name?: string;
    owner_email?: string;
    owner_phone?: string;
    ratingInfo?: RatingInfo;
    createdAt?: string;
    updatedAt?: string;
}

export interface MessState {
    messes: Mess[];
    currentMess: Mess | null;
    isLoading: boolean;
    error: string | null;
    pagination: Pagination | null;
    filters: MessFilters;
}

export interface MessFilters {
    search?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    roomType?: string;
    genderPreference?: string;
    facilities?: string[];
    sortBy?: 'price' | 'rating' | 'views' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    hasNext: boolean;
    hasPrev: boolean;
}

// Booking Types
export interface EmergencyContact {
    name: string;
    phone: string;
    relation: string;
}

export interface Booking {
    _id: string;
    user_id: User | string;
    mess_id: Mess | string;
    owner_id: User | string;
    bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'rejected' | 'completed';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    totalAmount: number;
    advanceMonths: number;
    checkInDate: string;
    tenantName: string;
    tenantPhone: string;
    tenantEmail: string;
    emergencyContact?: EmergencyContact;
    transactionId?: string;
    paymentMethod?: string;
    paidAt?: string;
    createdAt?: string;
}

export interface CreateBookingData {
    mess_id: string;
    checkInDate: string;
    paymentMethod: 'sslcommerz' | 'cash';
    tenantName: string;
    tenantPhone: string;
    tenantEmail: string;
    payAbleAmount: number;
    emergencyContact?: EmergencyContact;
}

export interface BookingState {
    bookings: Booking[];
    currentBooking: Booking | null;
    isLoading: boolean;
    error: string | null;
    counts?: {
        upcoming: number;
        past: number;
        total: number;
    };
}

// Review Types
export interface Review {
    _id: string;
    user_id: User | string;
    mess_id: Mess | string;
    rating: number;
    comment: string;
    status: 'active' | 'reported' | 'hidden';
    createdAt: string;
}

export interface CreateReviewData {
    mess_id: string;
    rating: number;
    comment: string;
}

// Saved Mess (Favorites)
export interface SavedMess {
    _id: string;
    mess_id: Mess;
    user_id: string;
    createdAt: string;
}

export interface FavoriteState {
    savedMesses: SavedMess[];
    isLoading: boolean;
    error: string | null;
}

// Request Types
export interface ViewRequest {
    _id: string;
    user_id: User | string;
    mess_id: Mess | string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    statusCode?: number;
    data: T;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: {
        messes?: T[];
        bookings?: T[];
        pagination: Pagination;
        counts?: any;
    };
}

// Payment Types
export interface PaymentInitResponse {
    paymentUrl: string;
    transactionId: string;
    amount: number;
    bookingId: string;
}

export interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
}

// Home Slider
export interface HomeSlider {
    _id: string;
    image: MessImage;
}

// Navigation Types
export type RootStackParamList = {
    '(auth)': undefined;
    '(tabs)': undefined;
    'mess/[id]': { id: string };
    'booking/[id]': { id: string };
    'booking/create': { messId: string };
    'payment': { paymentUrl: string; bookingId: string };
    'review/create': { messId: string; bookingId?: string };
};
