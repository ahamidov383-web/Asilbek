/**
 * Prisma Client Singleton
 * 
 * Bu fayl Prisma client'ning singleton pattern'ini ta'minlaydi.
 * Development va production muhitlarda to'g'ri ishlashini kafolatlaydi.
 * 
 * XAVFSIZLIK:
 * - Hot reload paytida yangi connection yaratilmaydi
 * - Connection pool to'g'ri boshqariladi
 * - Development muhitda logging yoqilgan
 * 
 * ESLATMA: Bu fayl Next.js loyihasi uchun mo'ljallangan.
 * React loyihasida faqat documentation uchun ishlatiladi.
 */

// ============================================
// PRISMA CLIENT (Next.js uchun)
// ============================================

/**
 * Prisma client singleton
 * 
 * Next.js hot reload paytida yangi Prisma instance yaratilmasligini ta'minlaydi.
 * Bu database connection'larning ko'payib ketishini oldini oladi.
 * 
 * @example
 * ```typescript
 * import { prisma } from '@/lib/prisma';
 * 
 * const users = await prisma.user.findMany();
 * ```
 */

// Global tip kengaytirish (TypeScript uchun)
// Browser va Node.js uchun moslashtirilgan
declare const globalThis: {
  prisma?: PrismaClientType;
  process?: {
    env?: {
      NODE_ENV?: string;
    };
  };
};

// Prisma client tipi (import qilinmasdan)
type PrismaClientType = {
  user: any;
  agency: any;
  tour: any;
  request: any;
  offer: any;
  place: any;
  restaurant: any;
  menuItem: any;
  transportRoute: any;
  busStop: any;
  routeStop: any;
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
};

// Prisma client yaratish
function createPrismaClient(): PrismaClientType {
  // Eslatma: Haqiqiy Next.js loyihasida bu yerda:
  // import { PrismaClient } from '@prisma/client';
  
  // Development muhitda logging yoqish
  // Browser muhitda process mavjud emas, shuning uchun tekshiramiz
  const isDev = typeof globalThis.process !== 'undefined' && globalThis.process?.env?.NODE_ENV === 'development';
  const logOptions = isDev
    ? [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ]
    : [{ level: 'error', emit: 'stdout' }];

  // Mock Prisma client (React loyihasi uchun)
  // Haqiqiy Next.js loyihasida: new PrismaClient({ log: logOptions })
  const mockClient: PrismaClientType = {
    user: {},
    agency: {},
    tour: {},
    request: {},
    offer: {},
    place: {},
    restaurant: {},
    menuItem: {},
    transportRoute: {},
    busStop: {},
    routeStop: {},
    $connect: async () => {
      console.log('🔌 Prisma connected (mock)');
    },
    $disconnect: async () => {
      console.log('🔌 Prisma disconnected (mock)');
    },
  };

  return mockClient;
}

// Singleton pattern
export const prisma: PrismaClientType = globalThis.prisma || createPrismaClient();

// Development muhitda global'ga saqlash (hot reload uchun)
if (typeof globalThis.process === 'undefined' || globalThis.process?.env?.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// ============================================
// DATABASE CONNECTION HELPERS
// ============================================

/**
 * Database'ga ulanish
 * XAVFSIZLIK: Connection error'larni to'g'ri ushlaydi
 */
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ Database\'ga muvaffaqiyatli ulandi');
  } catch (error) {
    console.error('❌ Database\'ga ulanishda xato:', error);
    throw new Error('Database\'ga ulanib bo\'lmadi');
  }
}

/**
 * Database'dan uzilish
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('✅ Database\'dan muvaffaqiyatli uzildi');
  } catch (error) {
    console.error('❌ Database\'dan uzilishda xato:', error);
  }
}

// ============================================
// TRANSACTION HELPERS
// ============================================

/**
 * Transaction ichida ishlash
 * XAVFSIZLIK: Agar xato bo'lsa, barcha o'zgarishlar bekor qilinadi
 * 
 * @example
 * ```typescript
 * await prismaTransaction(async (tx) => {
 *   await tx.user.create({ data: { ... } });
 *   await tx.agency.create({ data: { ... } });
 * });
 * ```
 */
export async function prismaTransaction<T>(
  fn: (tx: PrismaClientType) => Promise<T>
): Promise<T> {
  // Eslatma: Haqiqiy Next.js loyihasida:
  // return await prisma.$transaction(fn);
  
  // Mock implementation (React loyihasi uchun)
  return await fn(prisma);
}

// ============================================
// QUERY HELPERS
// ============================================

/**
 * Xavfsiz query wrapper
 * Xatolarni avtomatik ushlaydi va log qiladi
 * 
 * @example
 * ```typescript
 * const users = await safeQuery(() => 
 *   prisma.user.findMany({ where: { role: 'TOURIST' } })
 * );
 * ```
 */
export async function safeQuery<T>(
  query: () => Promise<T>,
  context?: string
): Promise<T | null> {
  try {
    return await query();
  } catch (error) {
    console.error(`❌ Query xatosi${context ? ` (${context})` : ''}:`, error);
    return null;
  }
}

/**
 * Count query helper
 * Pagination uchun foydali
 */
export async function safeCount(
  query: () => Promise<number>,
  context?: string
): Promise<number> {
  try {
    return await query();
  } catch (error) {
    console.error(`❌ Count xatosi${context ? ` (${context})` : ''}:`, error);
    return 0;
  }
}

// ============================================
// EXPORTS
// ============================================

export default prisma;

/**
 * Eslatma: Next.js loyihasiga ko'chirish uchun:
 * 
 * 1. Prisma o'rnatish:
 *    npm install @prisma/client
 *    npm install -D prisma
 * 
 * 2. Schema yaratish:
 *    npx prisma init
 * 
 * 3. Bu faylni yangilash:
 *    - Import qo'shish: import { PrismaClient } from '@prisma/client';
 *    - Mock client'ni o'chirish
 *    - Haqiqiy PrismaClient ishlatish
 * 
 * 4. Migration ishga tushirish:
 *    npx prisma migrate dev
 * 
 * 5. Seed ishga tushirish:
 *    npx prisma db seed
 */
