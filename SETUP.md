# 🚀 Termiz Tourism Platform - Setup Guide

## 📋 Umumiy Ma'lumot

Bu loyiha **React + Vite + TypeScript** asosida qurilgan bo'lib, Termiz shahri uchun turizm platformasini taqdim etadi.

### 🎯 Xususiyatlar:
- ✅ Termiz shahrining 5 ta diqqatga sazovor joyi
- ✅ 4 ta real restoran va ularning menyulari
- ✅ 3 ta transport yo'nalishi (avtobus va marshrutka)
- ✅ 9 ta avtobus bekati
- ✅ 2 ta tasdiqlangan agentlik
- ✅ Narx ko'rsatkichlari (transport, ovqat, attraksionlar)
- ✅ Role-based layout architecture (Tourist, Agency, Admin)
- ✅ Ko'p tillilik (O'zbek, Rus, Ingliz)

---

## 🗄️ Prisma Database (Next.js uchun)

Agar siz Next.js loyihasiga ko'chirmoqchi bo'lsangiz:

### 1. Prisma o'rnatish

```bash
npm install prisma @prisma/client
npm install -D @types/node ts-node
npm install bcryptjs
npm install -D @types/bcryptjs
```

### 2. package.json ga qo'shing

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

### 3. .env fayl yarating

```env
DATABASE_URL="postgresql://user:password@localhost:5432/termiz_tourism"
```

### 4. Database ni ishga tushiring

```bash
# Schema ni database ga qo'llash
npx prisma db push

# Seed ma'lumotlarini yuklash
npx prisma db seed
```

### 5. Prisma Studio (ixtiyoriy)

```bash
npx prisma studio
```

Bu buyruq database ma'lumotlarini ko'rish va tahrirlash uchun veb-interfeys ochadi.

---

## 🎨 React Loyihasi (Hozirgi)

### O'rnatish

```bash
npm install
```

### Ishga tushirish

```bash
npm run dev
```

### Build

```bash
npm run build
```

---

## 📍 Termiz Ma'lumotlari

### Diqqatga sazovor joylar:

1. **Fayoztepa** - Buddaviy ibodatxona (41.0850, 66.8500)
2. **Qoratepa** - Kushon davri buddaviy majmua (41.1000, 66.8200)
3. **Termiz Arxeologiya Muzeyi** - Shahar markazi (41.1100, 66.8300)
4. **Al-Hakim at-Termiziy maqbarasi** - Ziyoratgoh (41.1150, 66.8350)
5. **Sulton Saodat majmuasi** - Me'moriy yodgorlik (41.0500, 66.8000)

### Transport yo'nalishlari:

- **3-avtobus**: Istiqlol maydoni → Manguzar (2,000 so'm)
- **4-avtobus**: Vokzal → Markaz (2,000 so'm)
- **17-marshrutka**: Markaziy bank → Fayoztepa (3,000 so'm)

### Restoranlar:

1. **Naqsh Milliy Fast Food** - Osh, somsa (o'rtacha: 20,000 so'm)
2. **Choyxonai Zulayxo** - Kabob, lag'mon (o'rtacha: 30,000 so'm)
3. **Al-Qasr** - Shashlik, go'sht (o'rtacha: 45,000 so'm)
4. **Shahzod Nomdor Somsa Osh Markazi** - Somsa, osh (o'rtacha: 18,000 so'm)

---

## 🔐 Demo Hisoblar

```
👤 Turist:
   Email: tourist@test.com
   Parol: tourist123

🏢 Agentlik:
   Email: agency@test.com
   Parol: agency123

🛡️ Admin:
   Email: admin@test.com
   Parol: admin123
```

---

## 📁 Loyiha Tuzilishi

```
src/
├── layouts/           # Role-based layouts
│   ├── TouristLayout.tsx
│   ├── AgencyLayout.tsx
│   ├── AdminLayout.tsx
│   └── AuthLayout.tsx
├── pages/             # Sahifalar
│   ├── Home.tsx
│   ├── Places.tsx
│   ├── Restaurants.tsx
│   ├── Agencies.tsx
│   ├── AgencyProfile.tsx
│   ├── Tours.tsx
│   ├── Dashboard.tsx
│   ├── Admin.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── data/              # Ma'lumotlar
│   ├── mock.ts        # Umumiy mock data
│   ├── termiz.ts      # Termiz shahri ma'lumotlari
│   └── translations.ts
├── context/           # React Context
│   ├── AuthContext.tsx
│   └── LanguageContext.tsx
├── components/        # Komponentlar
│   └── ProtectedRoute.tsx
└── types/             # TypeScript types
    └── index.ts

prisma/                # Next.js uchun
├── schema.prisma      # Database schema
└── seed.ts            # Seed skripti
```

---

## 🌐 API Endpoints (Kelajakda)

Agar backend qo'shmoqchi bo'lsangiz:

```typescript
// GET /api/places - Barcha joylar
// GET /api/places/:id - Bitta joy
// GET /api/restaurants - Restoranlar
// GET /api/restaurants/:id - Restoran menyusi
// GET /api/routes - Transport yo'nalishlari
// GET /api/routes/:id - Yo'nalish bekatlari
// POST /api/requests - Sayohat so'rovi yuborish
// POST /api/offers - Agentlik taklifi yuborish
```

---

## 🛠️ Texnologiyalar

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Maps**: Leaflet + React-Leaflet
- **Animations**: Framer Motion

---

## 📞 Bog'lanish

- **Email**: info@termiz.travel
- **Telefon**: +998 76 225 00 00
- **Manzil**: Termiz sh., Surxondaryo viloyati, O'zbekiston

---

## 📄 Litsenziya

MIT License © 2026 Termiz Tourism Platform
