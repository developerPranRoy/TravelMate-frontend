import axios from 'axios';
import {
  User, Destination, TourPackage, Booking,
  ApiResponse, PaginatedResponse, AuthResponse,
} from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// The API sets an httpOnly cookie, but the frontend and API are on different
// origins. Browsers may refuse to store or send that cookie, so we also keep the
// token returned by login/register and send it as a Bearer header.
const TOKEN_KEY = 'travelmate_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) clearStoredToken();
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// --- Auth ---
export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string; agencyName?: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  getMe: () => api.get<ApiResponse<{ user: User }>>('/auth/me').then((r) => r.data),
};

// --- Destinations ---
export const destinationsApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<PaginatedResponse<Destination>>('/destinations', { params }).then((r) => r.data),
  getById: (id: string) =>
    api.get<ApiResponse<Destination>>(`/destinations/${id}`).then((r) => r.data),
  create: (data: Partial<Destination>) =>
    api.post<ApiResponse<Destination>>('/destinations', data).then((r) => r.data),
  update: (id: string, data: Partial<Destination>) =>
    api.patch<ApiResponse<Destination>>(`/destinations/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/destinations/${id}`).then((r) => r.data),
};

// --- Packages ---
export interface CreatePackagePayload {
  title: string;
  destinationId: string;
  description: string;
  price: number;
  durationDays: number;
  availableSeats: number;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
}

export const packagesApi = {
  list: (params?: {
    page?: number; limit?: number; search?: string; destinationId?: string;
    minPrice?: number; maxPrice?: number; startDate?: string; sort?: string;
  }) => api.get<PaginatedResponse<TourPackage>>('/packages', { params }).then((r) => r.data),
  getById: (id: string) =>
    api.get<ApiResponse<TourPackage>>(`/packages/${id}`).then((r) => r.data),
  create: (data: CreatePackagePayload) =>
    api.post<ApiResponse<TourPackage>>('/packages', data).then((r) => r.data),
  update: (id: string, data: Partial<CreatePackagePayload>) =>
    api.patch<ApiResponse<TourPackage>>(`/packages/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/packages/${id}`).then((r) => r.data),
  getMyPackages: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<TourPackage>>('/packages/agency/mine', { params }).then((r) => r.data),
};

// --- Bookings ---
export const bookingsApi = {
  create: (data: { packageId: string; travelerCount: number }) =>
    api.post<ApiResponse<Booking>>('/bookings', data).then((r) => r.data),
  getMyBookings: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<PaginatedResponse<Booking>>('/bookings/me', { params }).then((r) => r.data),
  getById: (id: string) =>
    api.get<ApiResponse<Booking>>(`/bookings/${id}`).then((r) => r.data),
  cancel: (id: string) =>
    api.patch<ApiResponse<Booking>>(`/bookings/${id}/cancel`).then((r) => r.data),
  getAgencyBookings: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<PaginatedResponse<Booking>>('/bookings/agency', { params }).then((r) => r.data),
  updateStatus: (id: string, status: string) =>
    api.patch<ApiResponse<Booking>>(`/bookings/agency/${id}/status`, { status }).then((r) => r.data),
};

// --- Admin ---
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard').then((r) => r.data),
  getUsers: (params?: { page?: number; limit?: number; search?: string; role?: string }) =>
    api.get('/admin/users', { params }).then((r) => r.data),
  getBookings: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/admin/bookings', { params }).then((r) => r.data),
  updateAgencyStatus: (id: string, status: string) =>
    api.patch(`/admin/agencies/${id}/status`, { status }).then((r) => r.data),
};

export default api;
