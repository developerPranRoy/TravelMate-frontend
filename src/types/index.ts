export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'AGENCY' | 'ADMIN';
  createdAt: string;
  agency?: Agency | null;
}

export interface Agency {
  id: string;
  agencyName: string;
  description?: string;
  contactNumber?: string;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  slug: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  _count?: { packages: number };
  packages?: TourPackage[];
}

export interface TourPackage {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  durationDays: number;
  availableSeats: number;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  agency: { id: string; agencyName: string };
  destination: { id: string; name: string; country: string; slug: string };
}

export interface Booking {
  id: string;
  bookingReference: string;
  customerId: string;
  packageId: string;
  travelerCount: number;
  unitPrice: string;
  totalPrice: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  tourPackage: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    imageUrl?: string;
    agency: { id: string; agencyName: string };
  };
  payment?: { id: string; amount: string; status: string };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}
