# Next.js Loyihasiga Ko'chirish Qo'llanmasi

Bu qo'llanma sizga React + Vite loyihasini Next.js 14+ ga ko'chirishga yordam beradi.

## 📋 Qadamlar

### 1. Next.js loyihasini yaratish

```bash
# Yangi Next.js loyihasi yaratish
npx create-next-app@latest visit-uzbekistan-nextjs --typescript --tailwind --app

# Loyihaga kirish
cd visit-uzbekistan-nextjs
```

### 2. Prisma o'rnatish

```bash
# Prisma va @prisma/client o'rnatish
npm install @prisma/client
npm install -D prisma

# Prisma init
npx prisma init
```

### 3. Environment variables

`.env` faylini `.env.example` dan nusxalang:

```bash
cp .env.example .env
```

`.env` faylini tahrirlang va haqiqiy qiymatlarni kiriting:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres?schema=public"
NEXTAUTH_SECRET="your-super-secret-key-minimum-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Prisma schema

`prisma/schema.prisma` faylini loyihadan nusxalang yoki quyidagi minimal versiyani ishlating:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(TOURIST)
  createdAt DateTime @default(now())
  agency    Agency?
  requests  Request[]
}

enum Role {
  TOURIST
  AGENCY
  ADMIN
}

model Agency {
  id          String   @id @default(cuid())
  name        String
  description String?
  logo        String?
  isVerified  Boolean  @default(false)
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  tours       Tour[]
  offers      Offer[]
}

model Tour {
  id             String   @id @default(cuid())
  title          String
  description    String
  price          Float
  availableSeats Int
  totalSeats     Int      @default(15)
  startDate      DateTime
  endDate        DateTime
  agencyId       String
  agency         Agency   @relation(fields: [agencyId], references: [id])
  requests       Request[]
}

model Request {
  id          String        @id @default(cuid())
  touristId   String
  tourist     User          @relation(fields: [touristId], references: [id])
  tourId      String?
  tour        Tour?         @relation(fields: [tourId], references: [id])
  budget      Float?
  interests   String?
  startDate   DateTime?
  endDate     DateTime?
  status      RequestStatus @default(PENDING)
  offers      Offer[]
}

enum RequestStatus {
  PENDING
  ACCEPTED
  REJECTED
}

model Offer {
  id        String      @id @default(cuid())
  requestId String
  request   Request     @relation(fields: [requestId], references: [id])
  agencyId  String
  agency    Agency      @relation(fields: [agencyId], references: [id])
  price     Float
  message   String
  status    OfferStatus @default(PENDING)
}

enum OfferStatus {
  PENDING
  ACCEPTED
  REJECTED
}

model Place {
  id          String  @id @default(cuid())
  name        String
  type        String
  howToGet    String
  workHours   String
  latitude    Float
  longitude   Float
  description String?
  ticketPrice String?
}

model Restaurant {
  id          String     @id @default(cuid())
  name        String
  cuisineType String[]
  avgPrice    Float
  latitude    Float
  longitude   Float
  address     String?
  menuItems   MenuItem[]
}

model MenuItem {
  id           String     @id @default(cuid())
  name         String
  price        Float
  description  String?
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
}

model AuditLog {
  id         String   @id @default(cuid())
  userId     String?
  action     String
  entityType String
  entityId   String
  details    Json?
  createdAt  DateTime @default(now())
}
```

### 5. Database'ga push qilish

```bash
# Schema ni database'ga push qilish
npx prisma db push

# Prisma client generatsiya qilish
npx prisma generate
```

### 6. Seed ma'lumotlari (ixtiyoriy)

```bash
# Seed skriptini ishga tushirish
npx prisma db seed
```

### 7. Prisma Studio (database ko'rish uchun)

```bash
npx prisma studio
```

Bu buyruq brauzerda database ma'lumotlarini ko'rish va tahrirlash uchun interfeys ochadi.

## 🔧 Prisma Client Singleton

`lib/prisma.ts` faylini yarating:

```typescript
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
```

## 📝 Package.json scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

## ✅ Tekshirish

Database ulanishini tekshirish:

```bash
# Prisma Studio ochish
npm run db:studio

# Yoki oddiy query
npx prisma db execute --stdin <<< "SELECT 1;"
```

## 🚀 Keyingi qadamlar

1. NextAuth.js sozlash
2. Server Actions yaratish
3. Middleware qo'shish
4. Route Groups yaratish

Batafsil ma'lumot uchun `README.md` faylini o'qing.
