# Ko'p tilli tizim - To'liq qo'llanma

## 📋 Umumiy ma'lumot

Bu loyiha Next.js va React (Vite) uchun ko'p tilli tizimni qo'llab-quvvatlaydi.

## 🎯 Asosiy tushunchalar

### Next.js vs React farqi

**Next.js (Server-side):**
```typescript
import { getLocale } from 'next-intl/server';

export async function getLocalizedField<T>(
  item: T,
  fieldBase: string
): Promise<string> {
  const locale = await getLocale(); // Async
  const fieldName = `${fieldBase}_${locale}` as keyof T;
  return (item[fieldName] as string) || (item[`${fieldBase}_uz`] as string) || '';
}
```

**React (Client-side):**
```typescript
import { useLanguage } from '../context/LanguageContext';

export function getLocalizedField<T>(
  item: T,
  fieldBase: string,
  lang: Language // Sync
): string {
  const fieldName = `${fieldBase}_${lang}` as keyof T;
  return (item[fieldName] as string) || (item[`${fieldBase}_uz`] as string) || '';
}
```

## 📁 Fayl strukturasi

```
src/
├── lib/
│   ├── types.ts              # TypeScript tiplari
│   └── i18n.ts               # Helper funksiyalar
├── context/
│   └── LanguageContext.tsx   # Til konteksti
├── data/
│   ├── mock.ts               # Mock ma'lumotlar (ko'p tilli)
│   └── termiz.ts             # Termiz ma'lumotlari (ko'p tilli)
└── pages/
    ├── PlaceDetail.tsx       # Obyekt tafsilotlari
    ├── RestaurantDetail.tsx  # Restoran tafsilotlari
    └── ...
```

## 🔧 Helper funksiyalar

### 1. `getLocalizedField` - Bitta maydonni tarjima qilish

```typescript
import { getLocalizedField } from '../lib/i18n';
import { useLanguage } from '../context/LanguageContext';

function Component() {
  const { language } = useLanguage();
  
  const name = getLocalizedField(place, 'name', language);
  const description = getLocalizedField(place, 'description', language);
  
  return (
    <div>
      <h1>{name}</h1>
      <p>{description}</p>
    </div>
  );
}
```

### 2. `getLocalizedObject` - Ko'p maydonlarni tarjima qilish

```typescript
import { getLocalizedObject } from '../lib/i18n';

const fields = getLocalizedObject(place, ['name', 'description', 'howToGet'], language);

// Ishlatish:
<h1>{fields.name}</h1>
<p>{fields.description}</p>
<p>{fields.howToGet}</p>
```

### 3. Qulay wrapper funksiyalar

```typescript
// Place uchun
import { getPlaceTranslation } from '../lib/i18n';
const translation = getPlaceTranslation(place, language);

// Restaurant uchun
import { getRestaurantTranslation } from '../lib/i18n';
const translation = getRestaurantTranslation(restaurant, language);

// MenuItem uchun
import { getMenuItemTranslation } from '../lib/i18n';
const translation = getMenuItemTranslation(menuItem, language);

// Agency uchun
import { getAgencyTranslation } from '../lib/i18n';
const translation = getAgencyTranslation(agency, language);

// Tour uchun
import { getTourTranslation } from '../lib/i18n';
const translation = getTourTranslation(tour, language);
```

### 4. Ro'yxatlarni tarjima qilish

```typescript
import { translateMenuItems, translatePlaces, translateRestaurants } from '../lib/i18n';

// Menyu elementlarini tarjima qilish
const translatedMenuItems = translateMenuItems(restaurant.menuItems, language);

// Obyektlarni tarjima qilish
const translatedPlaces = translatePlaces(places, language);

// Restoranlarni tarjima qilish
const translatedRestaurants = translateRestaurants(restaurants, language);
```

## 📊 Ma'lumotlar strukturasi

### Place modeli

```typescript
{
  id: 'fayoztepa',
  name_uz: 'Fayoztepa',
  name_ru: 'Фаязтепа',
  name_en: 'Fayaztepa',
  description_uz: 'Miloddan avvalgi I asrga oid buddaviy ibodatxona...',
  description_ru: 'Остатки буддийского храма I века до н.э...',
  description_en: 'Remains of a Buddhist temple from the 1st century BC...',
  howToGet_uz: 'Shahar markazidan 3-avtobusda...',
  howToGet_ru: 'От центра города на 3-автобусе...',
  howToGet_en: 'From city center by bus #3...',
  type: 'Arxeologik', // Universal
  workHours: '09:00 - 18:00', // Universal
  latitude: 41.0850,
  longitude: 66.8500,
}
```

### Restaurant modeli

```typescript
{
  id: 'naqsh',
  name_uz: 'Naqsh Milliy Fast Food',
  name_ru: 'Накш Национальный Фаст Фуд',
  name_en: 'Naqsh National Fast Food',
  description_uz: 'Milliy taomlar tez tayyorlanadigan restoran',
  description_ru: 'Ресторан быстрого питания с национальными блюдами',
  description_en: 'Fast food restaurant with national dishes',
  cuisineType: ['osh', 'somsa'], // Universal
  avgPrice: 20000, // Universal
  latitude: 41.1110,
  longitude: 66.8290,
  menuItems: [
    {
      id: 'naqsh-osh',
      name_uz: 'Termiz oshi',
      name_ru: 'Термезский плов',
      name_en: 'Termez Plov',
      description_uz: 'Mahalliy usulda tayyorlangan an\'anaviy osh',
      description_ru: 'Традиционный плов, приготовленный по местному рецепту',
      description_en: 'Traditional plov cooked in local style',
      price: 25000, // Universal
    }
  ]
}
```

## 🎨 Sahifalarda ishlatish

### PlaceDetail.tsx

```typescript
import { useLanguage } from '../context/LanguageContext';
import { getPlaceTranslation } from '../lib/i18n';

export default function PlaceDetail() {
  const { language } = useLanguage();
  const [place, setPlace] = useState<Place | null>(null);
  
  // Tarjima olish
  const translation = place ? getPlaceTranslation(place, language) : null;
  
  return (
    <div>
      <h1>{translation?.name}</h1>
      <p>{translation?.description}</p>
      <div>
        <h2>Qanday borish?</h2>
        <p>{translation?.howToGet}</p>
      </div>
    </div>
  );
}
```

### RestaurantDetail.tsx

```typescript
import { useLanguage } from '../context/LanguageContext';
import { getRestaurantTranslation, getMenuItemTranslation } from '../lib/i18n';

export default function RestaurantDetail() {
  const { language } = useLanguage();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  
  // Restoran tarjimasi
  const translation = restaurant ? getRestaurantTranslation(restaurant, language) : null;
  
  return (
    <div>
      <h1>{translation?.name}</h1>
      <p>{translation?.description}</p>
      
      {/* Menyu */}
      <div>
        {restaurant?.menuItems.map(item => {
          const menuTranslation = getMenuItemTranslation(item, language);
          return (
            <div key={item.id}>
              <h3>{menuTranslation.name}</h3>
              <p>{menuTranslation.description}</p>
              <span>{item.price} so'm</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Restaurants.tsx (ro'yxat)

```typescript
import { useLanguage } from '../context/LanguageContext';
import { getRestaurantTranslation } from '../lib/i18n';

export default function Restaurants() {
  const { language } = useLanguage();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  
  return (
    <div>
      {restaurants.map(restaurant => {
        const translation = getRestaurantTranslation(restaurant, language);
        return (
          <div key={restaurant.id}>
            <h2>{translation.name}</h2>
            <p>{translation.description}</p>
          </div>
        );
      })}
    </div>
  );
}
```

## 🔄 Next.js dan React ga ko'chirish

### Next.js (Server Component)

```typescript
import { getLocalizedField } from '@/lib/i18n-helpers';

export default async function PlacePage({ params }: { params: { id: string } }) {
  const place = await prisma.place.findUnique({ where: { id: params.id } });
  
  if (!place) notFound();
  
  const name = await getLocalizedField(place, 'name');
  const description = await getLocalizedField(place, 'description');
  const howToGet = await getLocalizedField(place, 'howToGet');
  
  return (
    <div>
      <h1>{name}</h1>
      <p>{description}</p>
      <div>
        <h2>{t('howToGet')}</h2>
        <p>{howToGet}</p>
      </div>
    </div>
  );
}
```

### React (Client Component)

```typescript
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedField } from '../lib/i18n';

export default function PlacePage() {
  const { language } = useLanguage();
  const [place, setPlace] = useState<Place | null>(null);
  
  // Ma'lumotlarni yuklash
  useEffect(() => {
    // API dan ma'lumot olish
    fetchPlace().then(setPlace);
  }, []);
  
  if (!place) return <div>Yuklanmoqda...</div>;
  
  const name = getLocalizedField(place, 'name', language);
  const description = getLocalizedField(place, 'description', language);
  const howToGet = getLocalizedField(place, 'howToGet', language);
  
  return (
    <div>
      <h1>{name}</h1>
      <p>{description}</p>
      <div>
        <h2>Qanday borish?</h2>
        <p>{howToGet}</p>
      </div>
    </div>
  );
}
```

## 🎯 Next.js uchun menyu elementlarini tarjima qilish

### Next.js (Server Component)

```typescript
const restaurantName = await getLocalizedField(restaurant, 'name');
const restaurantDescription = await getLocalizedField(restaurant, 'description');

// Menu items
const menuItems = await Promise.all(
  restaurant.menuItems.map(async (item) => ({
    ...item,
    name: await getLocalizedField(item, 'name'),
    description: await getLocalizedField(item, 'description'),
  }))
);
```

### React (Client Component)

```typescript
import { translateMenuItems } from '../lib/i18n';

const translation = getRestaurantTranslation(restaurant, language);
const translatedMenuItems = translateMenuItems(restaurant.menuItems, language);

return (
  <div>
    <h1>{translation.name}</h1>
    <p>{translation.description}</p>
    
    {translatedMenuItems.map(item => (
      <div key={item.id}>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <span>{item.price} so'm</span>
      </div>
    ))}
  </div>
);
```

## 📝 Muhim eslatmalar

1. **Fallback tizimi**: Agar tanlangan tilda tarjima bo'lmasa, o'zbek tiliga qaytadi
2. **Universal maydonlar**: `type`, `workHours`, `price`, `avgPrice` kabi maydonlar tarjima qilinmaydi
3. **Backward compatibility**: Eski `name`, `description` maydonlari ham qo'llab-quvvatlanadi
4. **TypeScript**: Barcha funksiyalar TypeScript bilan to'liq ishlaydi

## 🚀 Keyingi qadamlar

1. Barcha sahifalarni yangilash (Places, Restaurants, Agencies, Tours)
2. Mock ma'lumotlarni to'liq ko'p tilli qilish
3. Database migration (agar kerak bo'lsa)
4. Testing (har bir til uchun)

## 📚 Qo'shimcha resurslar

- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [next-intl documentation](https://next-intl-docs.vercel.app/)
- [React Context API](https://react.dev/learn/passing-data-deeply-with-context)
