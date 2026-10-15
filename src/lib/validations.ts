/**
 * Zod Validatsiya Sxemalari (Validation Schemas)
 * 
 * Bu fayl barcha forma validatsiyalarini bitta joyda saqlaydi.
 * Server Actions va Client Components da ishlatiladi.
 * 
 * XAVFSIZLIK: Barcha input'lar server tomonida validatsiya qilinadi!
 */

import { z } from 'zod';

// ============================================
// EMAIL VA PAROL VALIDATSIYASI
// ============================================

/**
 * Email validatsiyasi
 * - Oddiy email format tekshiruvi
 * - Minimal uzunlik: 5 belgi
 * - Minimal uzunlik: 254 belgi (RFC 5321)
 */
export const emailSchema = z
  .string()
  .min(1, 'Email kiritish majburiy')
  .email('Noto\'g\'ri email formati')
  .max(254, 'Email juda uzun');

/**
 * Parol validatsiyasi
 * - Minimal uzunlik: 8 belgi
 * - Kamida 1 ta katta harf
 * - Kamida 1 ta kichik harf
 * - Kamida 1 ta raqam
 * XAVFSIZLIK: Kuchli parol talablari
 */
export const passwordSchema = z
  .string()
  .min(8, 'Parol kamida 8 belgi bo\'lishi kerak')
  .max(128, 'Parol juda uzun')
  .regex(/[A-Z]/, 'Parol kamida 1 ta katta harf bo\'lishi kerak')
  .regex(/[a-z]/, 'Parol kamida 1 ta kichik harf bo\'lishi kerak')
  .regex(/[0-9]/, 'Parol kamida 1 ta raqam bo\'lishi kerak');

// ============================================
// LOGIN SCHEMA
// ============================================

/**
 * Login formasi validatsiyasi
 * - Email va parol majburiy
 * - Role majburiy (TOURIST, AGENCY, ADMIN)
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Parol kiritish majburiy'),
  role: z.enum(['TOURIST', 'AGENCY', 'ADMIN'], {
    message: 'Noto\'g\'ri rol tanlangan',
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================
// REGISTER TOURIST SCHEMA
// ============================================

/**
 * Turist ro'yxatdan o'tish formasi
 * - Ism, email, parol majburiy
 * - Parol tasdiqlashi majburiy
 * - Parollar mos kelishi kerak
 */
export const registerTouristSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Ism kamida 2 belgi bo\'lishi kerak')
      .max(100, 'Ism juda uzun'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Parollar mos kelmaydi',
    path: ['confirmPassword'],
  });

export type RegisterTouristInput = z.infer<typeof registerTouristSchema>;

// ============================================
// REGISTER AGENCY SCHEMA
// ============================================

/**
 * Agentlik ro'yxatdan o'tish formasi
 * - Agentlik nomi, ism, email, parol majburiy
 * - Telefon va manzil ixtiyoriy
 * - Shartlarga rozilik majburiy
 */
export const registerAgencySchema = z
  .object({
    agencyName: z
      .string()
      .min(3, 'Agentlik nomi kamida 3 belgi bo\'lishi kerak')
      .max(200, 'Agentlik nomi juda uzun'),
    name: z
      .string()
      .min(2, 'Ism kamida 2 belgi bo\'lishi kerak')
      .max(100, 'Ism juda uzun'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    description: z.string().max(1000, 'Tavsif juda uzun').optional(),
    phone: z
      .string()
      .regex(/^\+?[0-9\s\-\(\)]+$/, 'Noto\'g\'ri telefon formati')
      .optional(),
    address: z.string().max(300, 'Manzil juda uzun').optional(),
    license: z.string().max(50, 'Litsenziya raqami juda uzun').optional(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'Shartlarga rozilik bildirishingiz kerak',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Parollar mos kelmaydi',
    path: ['confirmPassword'],
  });

export type RegisterAgencyInput = z.infer<typeof registerAgencySchema>;

// ============================================
// CREATE TOUR SCHEMA
// ============================================

/**
 * Tur yaratish formasi
 * - Sarlavha, tavsif, narx, joylar soni majburiy
 * - Sanalar majburiy va to'g'ri tartibda bo'lishi kerak
 * - Narx musbat bo'lishi kerak
 */
export const createTourSchema = z
  .object({
    title: z
      .string()
      .min(5, 'Sarlavha kamida 5 belgi bo\'lishi kerak')
      .max(200, 'Sarlavha juda uzun'),
    description: z
      .string()
      .min(20, 'Tavsif kamida 20 belgi bo\'lishi kerak')
      .max(5000, 'Tavsif juda uzun'),
    price: z
      .number()
      .min(0, 'Narx manfiy bo\'lishi mumkin emas')
      .max(100000, 'Narx juda katta'),
    totalSeats: z
      .number()
      .int('Joylar soni butun son bo\'lishi kerak')
      .min(1, 'Kamida 1 ta joy bo\'lishi kerak')
      .max(100, 'Juda ko\'p joylar'),
    startDate: z.string().min(1, 'Boshlanish sanasi majburiy'),
    endDate: z.string().min(1, 'Tugash sanasi majburiy'),
    highlights: z.array(z.string().max(100)).max(10, 'Juda ko\'p highlight\'lar').optional(),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: 'Boshlanish sanasi tugash sanasidan oldin bo\'lishi kerak',
    path: ['endDate'],
  });

export type CreateTourInput = z.infer<typeof createTourSchema>;

// ============================================
// CREATE REQUEST SCHEMA
// ============================================

/**
 * Sayohat so'rovi yaratish formasi
 * - Byudjet ixtiyoriy, lekin musbat bo'lishi kerak
 * - Qiziqishlar majburiy
 * - Sanalar majburiy va to'g'ri tartibda
 */
export const createRequestSchema = z
  .object({
    budget: z
      .number()
      .min(0, 'Byudjet manfiy bo\'lishi mumkin emas')
      .max(1000000, 'Byudjet juda katta')
      .optional(),
    interests: z
      .string()
      .min(3, 'Qiziqishlar kamida 3 belgi bo\'lishi kerak')
      .max(500, 'Qiziqishlar juda uzun'),
    startDate: z.string().min(1, 'Boshlanish sanasi majburiy'),
    endDate: z.string().min(1, 'Tugash sanasi majburiy'),
    notes: z.string().max(2000, 'Izohlar juda uzun').optional(),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: 'Boshlanish sanasi tugash sanasidan oldin bo\'lishi kerak',
    path: ['endDate'],
  });

export type CreateRequestInput = z.infer<typeof createRequestSchema>;

// ============================================
// CREATE OFFER SCHEMA
// ============================================

/**
 * Taklif yaratish formasi
 * - So'rov ID majburiy
 * - Narx musbat bo'lishi kerak
 * - Xabar majburiy
 */
export const createOfferSchema = z.object({
  requestId: z.string().min(1, 'So\'rov ID majburiy'),
  price: z
    .number()
    .min(0, 'Narx manfiy bo\'lishi mumkin emas')
    .max(100000, 'Narx juda katta'),
  message: z
    .string()
    .min(10, 'Xabar kamida 10 belgi bo\'lishi kerak')
    .max(2000, 'Xabar juda uzun'),
});

export type CreateOfferInput = z.infer<typeof createOfferSchema>;

// ============================================
// VALIDATION HELPER FUNKSIYALAR
// ============================================

/**
 * Forma ma'lumotlarini validatsiya qilish
 * XAVFSIZLIK: Barcha input'lar server tomonida validatsiya qilinadi!
 * 
 * @param schema - Zod sxemasi
 * @param data - Validatsiya qilinadigan ma'lumotlar
 * @returns Validatsiya natijasi
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string[]> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  });

  return { success: false, errors };
}

/**
 * Forma xatolarini formatlash
 * UI da ko'rsatish uchun qulay format
 */
export function formatValidationErrors(errors: Record<string, string[]>): string {
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('; ');
}

// ============================================
// EKSPORTLAR
// ============================================

export { z };
