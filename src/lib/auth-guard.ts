/**
 * Autentifikatsiya Himoyasi (Authentication Guard)
 * 
 * Bu fayl route'lar va server actions uchun autentifikatsiya tekshiruvlarini o'z ichiga oladi.
 * React Router va Next.js middleware uchun ishlatiladi.
 * 
 * XAVFSIZLIK:
 * - Barcha himoyalangan route'lar tekshiriladi
 * - Rol asosida ruxsat berish
 * - Sessiya muddati tekshiruvi
 */

import { Role } from './types';
import { AuthenticationError, AuthorizationError, InsufficientRoleError } from './errors';

// ============================================
// SESSION TIPI
// ============================================

export interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  expires: string;
}

// ============================================
// AUTH GUARD FUNKSIYALAR
// ============================================

/**
 * Autentifikatsiya talab qilish
 * Foydalanuvchi tizimga kirgan bo'lishi kerak
 * 
 * XAVFSIZLIK: Sessiya mavjudligini tekshiradi
 * 
 * @param session - Joriy sessiya
 * @throws AuthenticationError - Agar sessiya yo'q bo'lsa
 */
export function requireAuth(session: Session | null | undefined): Session {
  if (!session) {
    throw new AuthenticationError('Tizimga kirish talab qilinadi');
  }

  // Sessiya muddatini tekshirish
  if (new Date(session.expires) < new Date()) {
    throw new AuthenticationError('Sessiya muddati tugagan. Iltimos, qayta kiring.');
  }

  return session;
}

/**
 * Rol talab qilish
 * Foydalanuvchi ma'lum bir rolga ega bo'lishi kerak
 * 
 * XAVFSIZLIK: Rol asosida ruxsat berish
 * 
 * @param session - Joriy sessiya
 * @param requiredRole - Talab qilinadigan rol
 * @throws AuthenticationError - Agar sessiya yo'q bo'lsa
 * @throws InsufficientRoleError - Agar rol mos kelmasa
 */
export function requireRole(session: Session | null | undefined, requiredRole: Role): Session {
  const authSession = requireAuth(session);

  if (authSession.user.role !== requiredRole) {
    throw new InsufficientRoleError(requiredRole, authSession.user.role);
  }

  return authSession;
}

/**
 * Agentlik roli talab qilish
 * Foydalanuvchi AGENCY roli ga ega bo'lishi kerak
 * 
 * @param session - Joriy sessiya
 * @throws AuthenticationError - Agar sessiya yo'q bo'lsa
 * @throws InsufficientRoleError - Agar AGENCY roli bo'lmasa
 */
export function requireAgency(session: Session | null | undefined): Session {
  return requireRole(session, 'AGENCY');
}

/**
 * Admin roli talab qilish
 * Foydalanuvchi ADMIN roli ga ega bo'lishi kerak
 * 
 * @param session - Joriy sessiya
 * @throws AuthenticationError - Agar sessiya yo'q bo'lsa
 * @throws InsufficientRoleError - Agar ADMIN roli bo'lmasa
 */
export function requireAdmin(session: Session | null | undefined): Session {
  return requireRole(session, 'ADMIN');
}

/**
 * Turist roli talab qilish
 * Foydalanuvchi TOURIST roli ga ega bo'lishi kerak
 * 
 * @param session - Joriy sessiya
 * @throws AuthenticationError - Agar sessiya yo'q bo'lsa
 * @throws InsufficientRoleError - Agar TOURIST roli bo'lmasa
 */
export function requireTourist(session: Session | null | undefined): Session {
  return requireRole(session, 'TOURIST');
}

// ============================================
// ROUTE PROTECTION HELPERS
// ============================================

/**
 * Route'ni himoyalash
 * React Router uchun middleware
 * 
 * @param session - Joriy sessiya
 * @param allowedRoles - Ruxsat etilgan rollar
 * @returns Ruxsat berish yoki rad etish
 */
export function protectRoute(
  session: Session | null | undefined,
  allowedRoles?: Role[]
): { allowed: boolean; redirect?: string; error?: string } {
  // Sessiya yo'q
  if (!session) {
    return {
      allowed: false,
      redirect: '/login',
      error: 'Tizimga kirish talab qilinadi',
    };
  }

  // Sessiya muddati tugagan
  if (new Date(session.expires) < new Date()) {
    return {
      allowed: false,
      redirect: '/login?error=session_expired',
      error: 'Sessiya muddati tugagan',
    };
  }

  // Rol tekshiruvi
  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return {
      allowed: false,
      redirect: '/login?error=access_denied',
      error: 'Bu sahifaga kirish uchun ruxsatingiz yo\'q',
    };
  }

  return { allowed: true };
}

/**
 * Agentlik route'larini himoyalash
 * 
 * @param session - Joriy sessiya
 * @returns Ruxsat berish yoki rad etish
 */
export function protectAgencyRoute(session: Session | null | undefined) {
  return protectRoute(session, ['AGENCY']);
}

/**
 * Admin route'larini himoyalash
 * 
 * @param session - Joriy sessiya
 * @returns Ruxsat berish yoki rad etish
 */
export function protectAdminRoute(session: Session | null | undefined) {
  return protectRoute(session, ['ADMIN']);
}

// ============================================
// SERVER ACTION GUARDS
// ============================================

/**
 * Server Action uchun autentifikatsiya tekshiruvi
 * Next.js Server Actions da ishlatiladi
 * 
 * XAVFSIZLIK: Server tomonida sessiya tekshiriladi
 * 
 * @param getSession - Sessiya olish funksiyasi
 * @returns Sessiya yoki xato
 */
export async function withAuth(
  getSession: () => Promise<Session | null>
): Promise<Session> {
  const session = await getSession();
  return requireAuth(session);
}

/**
 * Server Action uchun rol tekshiruvi
 * 
 * @param getSession - Sessiya olish funksiyasi
 * @param requiredRole - Talab qilinadigan rol
 * @returns Sessiya yoki xato
 */
export async function withRole(
  getSession: () => Promise<Session | null>,
  requiredRole: Role
): Promise<Session> {
  const session = await getSession();
  return requireRole(session, requiredRole);
}

/**
 * Server Action wrapper
 * Xatolarni avtomatik ushlaydi va formatlaydi
 * 
 * XAVFSIZLIK: Barcha xatolar log qilinadi
 * 
 * @param action - Server action funksiyasi
 * @returns Natija yoki xato
 */
export async function withErrorHandling<T>(
  action: () => Promise<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    // Xatoni log qilish
    console.error('Server Action xatosi:', error);

    // Foydalanuvchi uchun xabar
    if (error instanceof AuthenticationError) {
      return { success: false, error: error.message };
    }
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: 'Kutilmagan xato yuz berdi' };
  }
}

// ============================================
// PERMISSION CHECKS
// ============================================

/**
 * Foydalanuvchi o'z resursiga egalik qilishini tekshirish
 * 
 * XAVFSIZLIK: Foydalanuvchi faqat o'z resurslarini ko'rishi/boshqarishi mumkin
 * 
 * @param session - Joriy sessiya
 * @param resourceOwnerId - Resurs egasining ID
 * @throws AuthorizationError - Agar foydalanuvchi ega bo'lmasa
 */
export function requireOwnership(session: Session, resourceOwnerId: string): void {
  requireAuth(session);

  if (session.user.id !== resourceOwnerId) {
    throw new AuthorizationError('Bu resursga egalik qilmaysiz');
  }
}

/**
 * Foydalanuvchi o'z agentligiga egalik qilishini tekshirish
 * 
 * @param session - Joriy sessiya
 * @param agencyUserId - Agentlik egasining user ID
 * @throws AuthorizationError - Agar foydalanuvchi ega bo'lmasa
 */
export function requireAgencyOwnership(session: Session, agencyUserId: string): void {
  requireAgency(session);
  requireOwnership(session, agencyUserId);
}
