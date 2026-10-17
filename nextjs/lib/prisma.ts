import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * 
 * Bu singleton pattern development muhitda hot reload paytida
 * yangi Prisma instance yaratilishini oldini oladi.
 * Production muhitda bu muammo emas, lekin development da
 * database connection'lar soni ko'payib ketishi mumkin.
 * 
 * ESLATMA: Bu fayl Next.js loyihasi uchun mo'ljallangan.
 */

// Global tip kengaytirish (TypeScript uchun)
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Prisma client yaratish
function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    // Development muhitda query loglarini ko'rsatish
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn']
      : ['error'],
  });
}

// Singleton pattern
export const prisma = global.prisma || createPrismaClient();

// Development muhitda global'ga saqlash (hot reload uchun)
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

export default prisma;
