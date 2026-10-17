/**
 * Markazlashtirilgan Tiplar (Centralized Types)
 * 
 * Bu fayl barcha tiplarni bitta joydan eksport qiladi.
 * Next.js loyihasida bu tiplar Prisma schema'dan keladi.
 * React loyihasida esa biz TypeScript interfeyslarni ishlatamiz.
 * 
 * XAVFSIZLIK: Parol maydoni hech qachon frontend'ga yuborilmaydi!
 */

// ============================================
// ENUM TIPLAR (Prisma'dan)
// ============================================

export type Role = 'TOURIST' | 'AGENCY' | 'ADMIN';
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type Language = 'en' | 'ru' | 'uz';

// ============================================
// ASOSIY MODELLAR (Prisma'dan)
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  // XAVFSIZLIK: password maydoni hech qachon frontend'ga yuborilmaydi!
  // password: string; // ❌ BU YERDA BO'LMASLIGI KERAK
}

export interface Agency {
  id: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  isVerified: boolean;
  userId: string;
  tours?: Tour[];
  rating?: number;
  reviewCount?: number;
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
  agencyName?: string;
  agencyVerified?: boolean;
  image?: string;
  highlights?: string[];
}

export interface TourRequest {
  id: string;
  touristId: string;
  touristName?: string;
  tourId?: string | null;
  budget?: number | null;
  interests?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: RequestStatus;
  createdAt: string;
  offers?: Offer[];
}

export interface Offer {
  id: string;
  requestId: string;
  agencyId: string;
  agencyName?: string;
  price: number;
  message: string;
  status: OfferStatus;
}

export interface Place {
  id: string;
  // Multi-language fields
  name_uz: string;
  name_ru: string;
  name_en: string;
  description_uz?: string | null;
  description_ru?: string | null;
  description_en?: string | null;
  howToGet_uz?: string | null;
  howToGet_ru?: string | null;
  howToGet_en?: string | null;
  type: string; // Universal
  workHours: string; // Universal
  latitude: number;
  longitude: number;
  image?: string;
  ticketPrice?: string;
  // Backward compatibility (deprecated - use name_uz instead)
  name?: string;
  description?: string | null;
  howToGet?: string | null;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisineType: string[];
  avgPrice: number;
  latitude: number;
  longitude: number;
  address?: string;
  image?: string;
  rating?: number;
  menuItems: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
  restaurantId?: string;
}

// ============================================
// TRANSPORT MODELLARI
// ============================================

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

// ============================================
// DTO TIPLAR (API JAVOBLARI UCHUN)
// ============================================

/**
 * User DTO - Parol maydoni O'CHIRILGAN
 * XAVFSIZLIK: Server hech qachon parolni client'ga yubormaydi
 */
export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

/**
 * Agency DTO - To'liq ma'lumotlar (parol yo'q)
 */
export interface AgencyDTO {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  isVerified: boolean;
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

/**
 * Tour DTO - Agency ma'lumotlari bilan
 */
export interface TourDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  startDate: string;
  endDate: string;
  agency: {
    id: string;
    name: string;
    isVerified: boolean;
  };
  image?: string;
  highlights?: string[];
}

/**
 * Request DTO - Tourist va Offer ma'lumotlari bilan
 */
export interface RequestDTO {
  id: string;
  tourist: {
    id: string;
    name: string;
    email: string;
  };
  tour: TourDTO | null;
  budget: number | null;
  interests: string | null;
  startDate: string | null;
  endDate: string | null;
  status: RequestStatus;
  createdAt: string;
  offers: OfferDTO[];
}

/**
 * Offer DTO - Agency ma'lumotlari bilan
 */
export interface OfferDTO {
  id: string;
  agency: {
    id: string;
    name: string;
    isVerified: boolean;
  };
  price: number;
  message: string;
  status: OfferStatus;
}

// ============================================
// FORM TIPLAR (INPUT UCHUN)
// ============================================

export interface LoginForm {
  email: string;
  password: string;
  role: Role;
}

export interface RegisterTouristForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterAgencyForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agencyName: string;
  description?: string;
  phone?: string;
  address?: string;
  license?: string;
  agreeTerms: boolean;
}

export interface CreateTourForm {
  title: string;
  description: string;
  price: number;
  totalSeats: number;
  startDate: string;
  endDate: string;
  highlights?: string[];
}

export interface CreateRequestForm {
  budget?: number;
  interests: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface CreateOfferForm {
  requestId: string;
  price: number;
  message: string;
}

// ============================================
// AUDIT LOG
// ============================================

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string; // e.g., "AGENCY_APPROVED", "TOUR_CREATED"
  entityType: string; // e.g., "Agency", "Tour"
  entityId: string;
  details?: Record<string, any>;
  createdAt: string;
  userName?: string;
  userEmail?: string;
}

// Audit action tiplari
export type AuditAction = 
  | 'AGENCY_APPROVED'
  | 'AGENCY_REJECTED'
  | 'TOUR_CREATED'
  | 'TOUR_UPDATED'
  | 'TOUR_DELETED'
  | 'OFFER_CREATED'
  | 'OFFER_ACCEPTED'
  | 'OFFER_REJECTED'
  | 'REQUEST_CREATED'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_REGISTERED';

// ============================================
// API RESPONSE TIPLAR
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
