export type Role = 'TOURIST' | 'AGENCY' | 'ADMIN';
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type Language = 'en' | 'ru' | 'uz';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Agency {
  id: string;
  name: string;
  description: string;
  logo: string;
  isVerified: boolean;
  userId: string;
  tours: Tour[];
  rating: number;
  reviewCount: number;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  establishedYear?: number;
  languages?: string[];
  specialties?: string[];
  workingHours?: string;
  socialMedia?: {
    telegram?: string;
    instagram?: string;
    facebook?: string;
  };
  about?: string;
  achievements?: string[];
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  startDate: string;
  endDate: string;
  agencyId: string;
  agencyName: string;
  agencyVerified: boolean;
  image: string;
  highlights: string[];
}

export interface TourRequest {
  id: string;
  touristId: string;
  touristName: string;
  tourId?: string;
  budget?: number;
  interests: string;
  startDate: string;
  endDate: string;
  status: RequestStatus;
  offers: Offer[];
  createdAt: string;
}

export interface Offer {
  id: string;
  requestId: string;
  agencyId: string;
  agencyName: string;
  price: number;
  message: string;
  status: OfferStatus;
}

export interface Place {
  id: string;
  name: string;
  type: string;
  howToGet: string;
  workHours: string;
  latitude: number;
  longitude: number;
  description: string;
  image: string;
  ticketPrice: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisineType: string[];
  avgPrice: number;
  latitude: number;
  longitude: number;
  image: string;
  address: string;
  menuItems: MenuItem[];
  rating: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface TransportRoute {
  id: string;
  name: string;
  type: 'bus' | 'minibus' | 'metro';
  from: string;
  to: string;
  price: number;
  stops: RouteStop[];
}

export interface BusStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface RouteStop {
  stopId: string;
  stopName: string;
  order: number;
  latitude: number;
  longitude: number;
}
