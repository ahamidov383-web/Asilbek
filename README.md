# 🇺🇿 Visit Uzbekistan - Tourism Platform

O'zbekiston uchun zamonaviy turizm platformasi. Sayyohlar, agentliklar va administratorlar uchun to'liq funksional tizim.

## 📋 Loyiha haqida

Bu platforma O'zbekistondagi sayyohlik xizmatlarini raqamlashtirish uchun yaratilgan. Asosiy imkoniyatlar:

- **Sayyohlar uchun**: Tur so'rovlari yaratish, agentliklarni qidirish, takliflarni qabul/rad qilish
- **Agentliklar uchun**: Tur yaratish, so'rovlarni ko'rish, taklif yuborish, joylarni boshqarish
- **Administratorlar uchun**: Agentliklarni tasdiqlash, audit loglarni ko'rish, tizimni boshqarish

## 🛠️ Texnologiyalar

### Frontend
- **React 18** - UI kutubxonasi
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **React Hook Form + Zod** - Form validation
- **Leaflet + React-Leaflet** - Maps
- **Lucide React** - Icons

### Backend (Next.js versiyasi uchun)
- **Next.js 14+** - Framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **NextAuth.js** - Authentication
- **Server Actions** - API

### Testing & Quality
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚀 Ishga tushirish

### Talablar

- Node.js 18+ 
- npm yoki yarn
- PostgreSQL (Next.js versiyasi uchun)

### O'rnatish

```bash
# Repository ni clone qilish
git clone <repository-url>
cd visit-uzbekistan

# Dependencies o'rnatish
npm install

# Environment variables sozlash (Next.js uchun)
cp .env.example .env
# .env faylini tahrirlang
```

### Ishga tushirish

```bash
# Development server
npm run dev

# Production build
npm run build
npm run start
```

Sayt: http://localhost:5173

## 🔐 Demo hisoblar

### Sayyoh
- **Email**: tourist@test.com
- **Parol**: tourist123

### Agentlik
- **Email**: agency@test.com
- **Parol**: agency123

### Administrator
- **Email**: admin@test.com
- **Parol**: admin123

## 🧪 Testing

### Unit testlar

```bash
# Barcha testlarni ishga tushirish
npm run test

# Coverage bilan
npm run test:coverage

# Watch mode
npm run test:watch
```

### E2E testlar

```bash
# Playwright browserlarni o'rnatish
npx playwright install

# E2E testlarni ishga tushirish
npm run test:e2e

# UI mode da
npm run test:e2e:ui
```

### Code quality

```bash
# ESLint tekshiruvi
npm run lint

# ESLint fix
npm run lint:fix

# Prettier formatlash
npm run format
```

## 📁 Loyiha tuzilishi

```
visit-uzbekistan/
├── src/
│   ├── components/       # React komponentlar
│   ├── context/          # React Context (Auth, Language, etc.)
│   ├── data/             # Mock data va Termiz ma'lumotlari
│   ├── layouts/          # Layout komponentlar
│   ├── lib/              # Utility funksiyalar
│   ├── pages/            # Sahifa komponentlar
│   ├── test/             # Unit testlar
│   └── types/            # TypeScript tiplari
├── e2e/                  # E2E testlar
├── prisma/               # Prisma schema va seed
├── public/               # Static fayllar
└── package.json
```

## 🗺️ Asosiy sahifalar

### Sayyoh sahifalari
- `/` - Bosh sahifa
- `/places` - Diqqatga sazovor joylar
- `/places/:id` - Joy tafsilotlari
- `/restaurants` - Restoranlar
- `/agencies` - Agentliklar
- `/agencies/:id` - Agentlik profili
- `/tours` - Turlar
- `/request` - Tur so'rovi yaratish
- `/requests` - Mening so'rovlarim

### Agentlik sahifalari (himoyalangan)
- `/dashboard` - Boshqaruv paneli
- `/dashboard/tours` - Mening turlarim
- `/dashboard/tours/new` - Yangi tur
- `/dashboard/offers` - Takliflar
- `/dashboard/settings` - Sozlamalar

### Administrator sahifalari (himoyalangan)
- `/admin` - Admin panel
- `/admin/agencies` - Agentliklarni boshqarish
- `/admin/logs` - Audit loglar

### Autentifikatsiya
- `/login` - Kirish
- `/register` - Ro'yxatdan o'tish

## 🔒 Xavfsizlik

### Autentifikatsiya
- Role-based access control (RBAC)
- Session management
- Password hashing (bcrypt)
- CSRF protection

### Validatsiya
- Zod schema validation
- Server-side validation
- Client-side validation
- SQL injection prevention

### Audit logging
- Barcha kritik amallar log qilinadi
- User actions tracking
- Error monitoring

## 🌐 Ko'p tillilik

Platforma 3 tilda ishlaydi:
- 🇺🇿 O'zbek (default)
- 🇷🇺 Rus
- 🇬🇧 Ingliz

Tilni o'zgartirish uchun header dagi til tanlovini ishlating.

## 📊 Ma'lumotlar bazasi

### Asosiy modellar
- **User** - Foydalanuvchilar (TOURIST, AGENCY, ADMIN)
- **Agency** - Agentliklar
- **Tour** - Turlar
- **Request** - Sayyoh so'rovlari
- **Offer** - Agentlik takliflari
- **Place** - Diqqatga sazovor joylar
- **Restaurant** - Restoranlar
- **AuditLog** - Audit loglar

### Prisma (Next.js versiyasi)

```bash
# Database schema ni qo'llash
npm run db:push

# Seed ma'lumotlarini yuklash
npm run db:seed

# Prisma Studio
npx prisma studio
```

## 🎨 UI Komponentlar

### Map komponenti
- Dynamic import (performance)
- Custom markers
- Popup'lar
- Responsive

### Form komponentlar
- React Hook Form
- Zod validation
- Error handling
- Loading states

### Layout komponentlar
- TouristLayout - Sayyohlar uchun
- AgencyLayout - Agentliklar uchun
- AdminLayout - Administratorlar uchun
- AuthLayout - Login/Register uchun

## 🚀 Deploy

### Vercel (Tavsiya etiladi)

```bash
# Vercel CLI o'rnatish
npm i -g vercel

# Deploy qilish
vercel
```

### Boshqa platformalar

1. **Netlify**
   - Build command: `npm run build`
   - Output directory: `dist`

2. **Railway**
   - PostgreSQL database qo'shing
   - Environment variables sozlang

3. **Docker**
   ```bash
   docker build -t visit-uzbekistan .
   docker run -p 3000:3000 visit-uzbekistan
   ```

## 📝 Environment Variables

```env
# Database (Next.js)
DATABASE_URL="postgresql://user:password@localhost:5432/visit_uzbekistan"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email (optional)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email"
SMTP_PASS="your-password"
```

## 🤝 Hissa qo'shish

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/AmazingFeature`)
3. Commit qiling (`git commit -m 'Add AmazingFeature'`)
4. Push qiling (`git push origin feature/AmazingFeature`)
5. Pull Request oching

## 📄 Litsenziya

MIT License © 2026 Visit Uzbekistan

## 📞 Bog'lanish

- **Email**: info@visituzbekistan.com
- **Telegram**: @visituzbekistan
- **Website**: https://visituzbekistan.com

## 🙏 Minnatdorchilik

Bu loyiha O'zbekiston turizmini rivojlantirish uchun yaratilgan. Barcha agentliklar va sayyohlar uchun qulay platforma yaratish maqsad qilingan.

---

**Made with ❤️ for Uzbekistan**
