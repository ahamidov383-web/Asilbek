// Narx ma'lumotlari strukturasi
// O'zbekiston bo'yicha 2024-2025 yillar uchun

export interface PriceRange {
  min: number;
  max: number;
  currency?: string;
  unit?: string;
  note?: string;
}

export interface PriceItem {
  id: string;
  name: string;
  description?: string;
  price: PriceRange;
  icon?: string;
  tip?: string;
}

export interface PriceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  items: PriceItem[];
}

export interface CityPrices {
  city: string;
  categories: PriceCategory[];
}

// Valyuta kurslari (2024-2025)
export const exchangeRates = {
  USD: 12500, // 1 USD = 12,500 UZS
  EUR: 13500, // 1 EUR = 13,500 UZS
  RUB: 135,   // 1 RUB = 135 UZS
};

// Umumiy narx qo'llanmasi (barcha shaharlar uchun)
export const generalPrices: PriceCategory[] = [
  {
    id: 'transport',
    name: 'Transport narxlari',
    icon: '🚗',
    description: 'Shahar ichi va shaharlararo transport',
    items: [
      {
        id: 'taxi-city',
        name: 'Taksi (shahar ichi)',
        description: 'Shahar ichida taksi narxi',
        price: { min: 10000, max: 20000, unit: 'so\'m' },
        icon: '🚕',
        tip: 'Yandex Go yoki Uy Taxi ilovalaridan foydalaning - narx oldindan ma\'lum',
      },
      {
        id: 'public-transport',
        name: 'Jamoat transporti',
        description: 'Avtobus va marshrutka',
        price: { min: 3000, max: 5000, unit: 'so\'m' },
        icon: '🚌',
        tip: 'Naqd pul tayyorlang, ko\'p joyda karta ishlamaydi',
      },
      {
        id: 'metro',
        name: 'Metro (Toshkent)',
        description: 'Toshkent metrosi',
        price: { min: 2000, max: 2000, unit: 'so\'m' },
        icon: '🚇',
        tip: 'Metro kartasini stansiyadan sotib olishingiz mumkin',
      },
      {
        id: 'intercity-taxi',
        name: 'Shaharlararo taksi',
        description: 'Bir shahardan boshqasiga',
        price: { min: 5000, max: 10000, unit: 'so\'m/km', note: 'O\'rtacha narx' },
        icon: '🚙',
        tip: 'Narxni oldindan kelishing, yo\'l haqini so\'rash',
      },
      {
        id: 'train',
        name: 'Poyezd (Afrosiyob)',
        description: 'Tezkor poyezd',
        price: { min: 100000, max: 300000, unit: 'so\'m', note: 'Ekonombusdan biznesgacha' },
        icon: '🚄',
        tip: 'Chiptalarni oldindan bron qiling, ayniqsa yoz mavsumida',
      },
    ],
  },
  {
    id: 'tickets',
    name: 'Chipta narxlari',
    icon: '🎫',
    description: 'Muzeylar, yodgorliklar va madaniy tadbirlar',
    items: [
      {
        id: 'museum-local',
        name: 'Muzeylar (mahalliy)',
        description: 'Mahalliy aholi uchun',
        price: { min: 10000, max: 30000, unit: 'so\'m' },
        icon: '🏛️',
        tip: 'Talaba guvohnomasi bo\'lsa, 50% chegirma',
      },
      {
        id: 'museum-foreign',
        name: 'Muzeylar (chet elliklar)',
        description: 'Xorijiy sayyohlar uchun',
        price: { min: 30000, max: 80000, unit: 'so\'m' },
        icon: '🏛️',
        tip: 'Ba\'zi joylarda foto/video uchun qo\'shimcha to\'lov',
      },
      {
        id: 'theater',
        name: 'Teatr va konsertlar',
        description: 'Madaniy tadbirlar',
        price: { min: 50000, max: 200000, unit: 'so\'m' },
        icon: '🎭',
        tip: 'Chiptalarni oldindan sotib oling',
      },
      {
        id: 'amusement',
        name: 'Amusement parklar',
        description: 'Ko\'ngilochar joylar',
        price: { min: 30000, max: 100000, unit: 'so\'m' },
        icon: '🎢',
        tip: 'Bolalar uchun chegirmalar mavjud',
      },
    ],
  },
  {
    id: 'food',
    name: 'Taom narxlari',
    icon: '🍽️',
    description: 'Restoranlar va kafelar',
    items: [
      {
        id: 'cheap-restaurant',
        name: 'Arzon choyxona',
        description: 'Oddiy choyxona va oshxonalar',
        price: { min: 15000, max: 25000, unit: 'so\'m', note: 'Osh uchun' },
        icon: '🍚',
        tip: 'Mahalliy aholi bilan birga ovqatlaning - eng mazali taomlar',
      },
      {
        id: 'medium-restaurant',
        name: 'O\'rtacha restoran',
        description: 'Qulay restoranlar',
        price: { min: 25000, max: 40000, unit: 'so\'m', note: 'Osh uchun' },
        icon: '🍽️',
        tip: 'Tushlik vaqti (12:00-14:00) arzonroq bo\'lishi mumkin',
      },
      {
        id: 'expensive-restaurant',
        name: 'Qimmat restoran',
        description: 'Premium restoranlar',
        price: { min: 40000, max: 70000, unit: 'so\'m', note: 'Osh uchun' },
        icon: '🥂',
        tip: 'Bron qilish tavsiya etiladi',
      },
      {
        id: 'fast-food',
        name: 'Fast food',
        description: 'Lavash, shaurma va boshqalar',
        price: { min: 15000, max: 25000, unit: 'so\'m', note: 'Lavash uchun' },
        icon: '🌯',
        tip: 'Ko\'cha taomlari mazali va arzon',
      },
      {
        id: 'drinks',
        name: 'Ichimliklar',
        description: 'Choy, kofe, soda',
        price: { min: 5000, max: 15000, unit: 'so\'m', note: 'Choy: 5,000-10,000, Cola: 10,000-15,000' },
        icon: '🫖',
        tip: 'Choyxonalarda choy bepul yoki juda arzon',
      },
    ],
  },
  {
    id: 'hotel',
    name: 'Mehmonxona narxlari',
    icon: '🏨',
    description: 'Turli darajadagi mehmonxonalar',
    items: [
      {
        id: 'hostel',
        name: 'Hostel',
        description: 'Byudjet turar joy',
        price: { min: 100000, max: 200000, unit: 'so\'m/kecha' },
        icon: '🛏️',
        tip: 'Oldindan bron qiling, ayniqsa yoz mavsumida',
      },
      {
        id: 'hotel-3star',
        name: '3 yulduzli mehmonxona',
        description: 'Qulay mehmonxona',
        price: { min: 300000, max: 600000, unit: 'so\'m/kecha' },
        icon: '🏨',
        tip: 'Nonus ko\'pincha narxga kiritilgan',
      },
      {
        id: 'hotel-4star',
        name: '4 yulduzli mehmonxona',
        description: 'Yuqori darajali mehmonxona',
        price: { min: 600000, max: 1200000, unit: 'so\'m/kecha' },
        icon: '🏩',
        tip: 'WiFi va nonus odatda kiritilgan',
      },
      {
        id: 'hotel-5star',
        name: '5 yulduzli mehmonxona',
        description: 'Premium mehmonxona',
        price: { min: 1200000, max: 3000000, unit: 'so\'m/kecha' },
        icon: '🏰',
        tip: 'Xizmatlar va qulayliklar yuqori darajada',
      },
    ],
  },
  {
    id: 'tour',
    name: 'Ekskursiya va gid narxlari',
    icon: '🗺️',
    description: 'Gidlar va ekskursiyalar',
    items: [
      {
        id: 'group-tour',
        name: 'Guruhli ekskursiya',
        description: 'Guruh bilan sayohat',
        price: { min: 100000, max: 300000, unit: 'so\'m/kishi' },
        icon: '👥',
        tip: 'Katta guruhda arzonroq bo\'ladi',
      },
      {
        id: 'private-guide',
        name: 'Shaxsiy gid',
        description: 'Individual gid xizmati',
        price: { min: 500000, max: 1500000, unit: 'so\'m/kun' },
        icon: '🧑‍🏫',
        tip: 'Ingliz/Rus tillarini biladigan gid tanlang',
      },
      {
        id: 'audio-guide',
        name: 'Audio gid',
        description: 'Quloqchin bilan gid',
        price: { min: 30000, max: 50000, unit: 'so\'m' },
        icon: '🎧',
        tip: 'Ba\'zi muzeylarda bepul audio gid mavjud',
      },
    ],
  },
];

// Shaharlar bo'yicha narxlar (ixtiyoriy)
export const citySpecificPrices: CityPrices[] = [
  {
    city: 'Toshkent',
    categories: [
      {
        id: 'metro',
        name: 'Metro',
        icon: '🚇',
        description: 'Toshkent metrosi',
        items: [
          {
            id: 'metro-ticket',
            name: 'Metro chiptasi',
            price: { min: 2000, max: 2000, unit: 'so\'m' },
            icon: '🚇',
          },
        ],
      },
    ],
  },
  {
    city: 'Samarqand',
    categories: [
      {
        id: 'tickets',
        name: 'Chipta narxlari',
        icon: '🎫',
        description: 'Samarqand yodgorliklari',
        items: [
          {
            id: 'registan',
            name: 'Registon',
            price: { min: 30000, max: 80000, unit: 'so\'m' },
            icon: '🏛️',
          },
        ],
      },
    ],
  },
];

// Foydali maslahatlar
export const touristTips = [
  {
    id: 'cash',
    title: 'Naqd pul oling',
    description: 'Ko\'p joyda karta ishlamaydi, ayniqsa kichik do\'konlar va bozorlarda',
    icon: '💵',
  },
  {
    id: 'bargaining',
    title: 'Narxni kelishing',
    description: 'Bozorlarda va taksida narxni kelishish mumkin',
    icon: '🤝',
  },
  {
    id: 'apps',
    title: 'Ilovalarni o\'rnating',
    description: 'Yandex Go (taksi), 2GIS (xarita), Google Translate',
    icon: '📱',
  },
  {
    id: 'water',
    title: 'Suv olib yuring',
    description: 'Yozda harorat 40°C ga yetishi mumkin',
    icon: '💧',
  },
  {
    id: 'dress-code',
    title: 'Kiyim kodeksi',
    description: 'Masjid va ziyoratgohlarga kirishda ehtiyotkor bo\'ling',
    icon: '👔',
  },
];

// Valyuta konvertori funksiyasi
export function convertCurrency(amount: number, from: keyof typeof exchangeRates, to: 'UZS' | keyof typeof exchangeRates = 'UZS'): number {
  if (to === 'UZS') {
    return Math.round(amount * exchangeRates[from]);
  }
  const uzsAmount = amount * exchangeRates[from];
  return Math.round(uzsAmount / exchangeRates[to]);
}

// Narxni formatlash
export function formatPrice(amount: number, currency: string = 'UZS'): string {
  return `${amount.toLocaleString()} ${currency}`;
}

// Narx diapazonini formatlash
export function formatPriceRange(range: PriceRange): string {
  if (range.min === range.max) {
    return `${range.min.toLocaleString()} ${range.unit || 'so\'m'}`;
  }
  return `${range.min.toLocaleString()} - ${range.max.toLocaleString()} ${range.unit || 'so\'m'}`;
}
