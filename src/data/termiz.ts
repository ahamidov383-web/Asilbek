import { Place, Restaurant, TransportRoute, BusStop, Agency } from '../types';

// ============================================
// TERMIZ SHAHRI MA'LUMOTLARI
// Haqiqiy rasmlar va dinamik ma'lumotlar
// ============================================

// Diqqatga sazovor joylar
export const termizPlaces: Place[] = [
  {
    id: 'fayoztepa',
    name_uz: 'Fayoztepa',
    name_ru: 'Фаязтепа',
    name_en: 'Fayaztepa',
    type: 'Arxeologik',
    description_uz: 'Miloddan avvalgi I asrga oid buddaviy ibodatxona qoldiqlari. Termiz shahridan 12 km janubda joylashgan. Bu yerda buddaviy monastir va stupalar qoldiqlari topilgan.',
    description_ru: 'Остатки буддийского храма I века до н.э. Расположен в 12 км к югу от города Термез. Здесь обнаружены остатки буддийского монастыря и ступ.',
    description_en: 'Remains of a Buddhist temple from the 1st century BC. Located 12 km south of Termez city. Buddhist monastery and stupa remains found here.',
    howToGet_uz: 'Shahar markazidan 3-avtobusda "Fayoztepa" bekatigacha, so\'ng 2 km piyoda. Yoki taksi bilan 15-20 daqiqa.',
    howToGet_ru: 'От центра города на 3-автобусе до остановки "Фаязтепа", затем 2 км пешком. Или на такси 15-20 минут.',
    howToGet_en: 'From city center by bus #3 to "Fayaztepa" stop, then 2 km walk. Or by taxi 15-20 minutes.',
    workHours: '09:00 - 18:00 (Dushanba - Yakshanba)',
    latitude: 41.0850,
    longitude: 66.8500,
    image: 'https://image.qwenlm.ai/generated-images/aca6416f-8752-4dff-b344-a2543c04e61a/_result.png',
    ticketPrice: '20,000 so\'m',
  },
  {
    id: 'qoratepa',
    name_uz: 'Qoratepa',
    name_ru: 'Кара-тепа',
    name_en: 'Kara-tepa',
    type: 'Arxeologik',
    description_uz: 'Kushon davriga oid qadimiy buddaviy majmua. Milodiy I-III asrlarda qurilgan. Bu yerda buddaviy ibodatxona, monastir va stupalar qoldiqlari saqlangan.',
    description_ru: 'Древний буддийский комплекс эпохи Кушан. Построен в I-III вв. н.э. Здесь сохранились остатки буддийского храма, монастыря и ступ.',
    description_en: 'Ancient Buddhist complex from the Kushan era. Built in the 1st-3rd centuries AD. Remains of Buddhist temple, monastery and stupas preserved here.',
    howToGet_uz: 'Shahar markazidan 4-avtobusda "Qoratepa" bekatigacha. Yoki taksi bilan 10 daqiqa.',
    howToGet_ru: 'От центра города на 4-автобусе до остановки "Кара-тепа". Или на такси 10 минут.',
    howToGet_en: 'From city center by bus #4 to "Kara-tepa" stop. Or by taxi 10 minutes.',
    workHours: '09:00 - 17:00 (Dushanba - Shanba)',
    latitude: 41.1000,
    longitude: 66.8200,
    image: 'https://image.qwenlm.ai/generated-images/cc6210b4-05b4-4a61-8e73-1c4d0fcbee3e/_result.png',
    ticketPrice: '15,000 so\'m',
  },
  {
    id: 'termiz-museum',
    name_uz: 'Termiz Arxeologiya Muzeyi',
    name_ru: 'Термезский Археологический Музей',
    name_en: 'Termez Archaeological Museum',
    type: 'Muzey',
    description_uz: 'Termiz va uning atrofidagi hududlarning qadimiy tarixiga bag\'ishlangan muzey. Buddaviy davr, Kushon imperiyasi va Ipak yo\'li davriga oid eksponatlar.',
    description_ru: 'Музей, посвященный древней истории Термеза и окрестностей. Экспонаты буддийской эпохи, империи Кушан и Великого шелкового пути.',
    description_en: 'Museum dedicated to ancient history of Termez and surrounding areas. Exhibits from Buddhist era, Kushan Empire and Silk Road period.',
    howToGet_uz: 'Shahar markazida, Istiqlol maydoni yaqinida. 4-avtobusda "Markaz" bekatigacha.',
    howToGet_ru: 'В центре города, рядом с площадью Истиклол. На 4-автобусе до остановки "Центр".',
    howToGet_en: 'In city center, near Istiklol Square. By bus #4 to "Center" stop.',
    workHours: '09:00 - 17:00 (Dushanba - Juma), 10:00 - 15:00 (Shanba)',
    latitude: 41.1100,
    longitude: 66.8300,
    image: 'https://image.qwenlm.ai/generated-images/525e0328-c744-4d17-a0ea-0107026e4c1d/_result.png',
    ticketPrice: '25,000 so\'m',
  },
  {
    id: 'al-hakim-at-termiziy',
    name_uz: 'Al-Hakim at-Termiziy maqbarasi',
    name_ru: 'Мавзолей Аль-Хакима ат-Термизи',
    name_en: 'Al-Hakim al-Termezi Mausoleum',
    type: 'Ziyoratgoh',
    description_uz: 'IX asrda yashagan mashhur islom olimi va mutafakkiri Al-Hakim at-Termiziyning maqbarasi. Ziyoratchilar uchun muqaddas joy.',
    description_ru: 'Мавзолей известного исламского ученого и мыслителя IX века Аль-Хакима ат-Термизи. Святое место для паломников.',
    description_en: 'Mausoleum of famous Islamic scholar and thinker of the 9th century Al-Hakim al-Termezi. Sacred place for pilgrims.',
    howToGet_uz: 'Shahar markazidan 17-marshrutkada "Al-Hakim at-Termiziy" bekatigacha. Yoki taksi bilan 5 daqiqa.',
    howToGet_ru: 'От центра города на 17-маршрутке до остановки "Аль-Хаким ат-Термизи". Или на такси 5 минут.',
    howToGet_en: 'From city center by minibus #17 to "Al-Hakim al-Termezi" stop. Or by taxi 5 minutes.',
    workHours: '08:00 - 20:00 (Har kuni)',
    latitude: 41.1150,
    longitude: 66.8350,
    image: 'https://image.qwenlm.ai/generated-images/5b8a99e5-fdb0-4e97-81f5-5ee61bdfe2f6/_result.png',
    ticketPrice: 'Bepul',
  },
  {
    id: 'sulton-saodat',
    name_uz: 'Sulton Saodat majmuasi',
    name_ru: 'Комплекс Султан-Саадат',
    name_en: 'Sultan Saodat Complex',
    type: 'Me\'moriy yodgorlik',
    description_uz: 'IX-XII asrlarga oid me\'moriy majmua. Termizdan 20 km janubda joylashgan. Sayyidlar avlodining dafn etilgan joyi.',
    description_ru: 'Архитектурный комплекс IX-XII веков. Расположен в 20 км к югу от Термеза. Место захоронения потомков сайидов.',
    description_en: 'Architectural complex of the 9th-12th centuries. Located 20 km south of Termez. Burial place of sayyid descendants.',
    howToGet_uz: 'Shahar markazidan taksi bilan 25-30 daqiqa. Jamoat transporti yo\'q.',
    howToGet_ru: 'От центра города на такси 25-30 минут. Общественного транспорта нет.',
    howToGet_en: 'From city center by taxi 25-30 minutes. No public transport.',
    workHours: '08:00 - 18:00 (Har kuni)',
    latitude: 41.0500,
    longitude: 66.8000,
    image: 'https://image.qwenlm.ai/generated-images/8ab8db93-5221-4cdd-b179-af3d685b512e/_result.png',
    ticketPrice: '10,000 so\'m',
  },
];

// Avtobus bekatlari
export const termizBusStops: BusStop[] = [
  { id: 'yashil-dunyo', name: 'Yashil dunyo bozor', latitude: 41.1120, longitude: 66.8280 },
  { id: 'avtostansiya', name: 'Termiz Avtostansiyasi', latitude: 41.1200, longitude: 66.8400 },
  { id: 'markaziy-bank', name: 'Markaziy bank bekati', latitude: 41.1100, longitude: 66.8300 },
  { id: 'istiqlol', name: 'Istiqlol maydoni', latitude: 41.1080, longitude: 66.8320 },
  { id: 'manguzar', name: 'Manguzar', latitude: 41.0950, longitude: 66.8150 },
  { id: 'vokzal', name: 'Vokzal', latitude: 41.1250, longitude: 66.8450 },
  { id: 'fayoztepa-stop', name: 'Fayoztepa', latitude: 41.0850, longitude: 66.8500 },
  { id: 'qoratepa-stop', name: 'Qoratepa', latitude: 41.1000, longitude: 66.8200 },
  { id: 'al-hakim-stop', name: 'Al-Hakim at-Termiziy', latitude: 41.1150, longitude: 66.8350 },
];

// Transport yo'nalishlari
export const termizRoutes: TransportRoute[] = [
  {
    id: 'route-3',
    name: '3-avtobus',
    type: 'bus',
    from: 'Istiqlol maydoni',
    to: 'Manguzar',
    price: 2000,
    stops: [
      { stopId: 'istiqlol', stopName: 'Istiqlol maydoni', order: 1, latitude: 41.1080, longitude: 66.8320 },
      { stopId: 'markaziy-bank', stopName: 'Markaziy bank bekati', order: 2, latitude: 41.1100, longitude: 66.8300 },
      { stopId: 'yashil-dunyo', stopName: 'Yashil dunyo bozor', order: 3, latitude: 41.1120, longitude: 66.8280 },
      { stopId: 'manguzar', stopName: 'Manguzar', order: 4, latitude: 41.0950, longitude: 66.8150 },
    ],
  },
  {
    id: 'route-4',
    name: '4-avtobus',
    type: 'bus',
    from: 'Vokzal',
    to: 'Markaz',
    price: 2000,
    stops: [
      { stopId: 'vokzal', stopName: 'Vokzal', order: 1, latitude: 41.1250, longitude: 66.8450 },
      { stopId: 'avtostansiya', stopName: 'Termiz Avtostansiyasi', order: 2, latitude: 41.1200, longitude: 66.8400 },
      { stopId: 'markaziy-bank', stopName: 'Markaziy bank bekati', order: 3, latitude: 41.1100, longitude: 66.8300 },
      { stopId: 'istiqlol', stopName: 'Istiqlol maydoni', order: 4, latitude: 41.1080, longitude: 66.8320 },
    ],
  },
  {
    id: 'route-17',
    name: '17-marshrutka',
    type: 'minibus',
    from: 'Markaziy bank bekati',
    to: 'Fayoztepa',
    price: 3000,
    stops: [
      { stopId: 'markaziy-bank', stopName: 'Markaziy bank bekati', order: 1, latitude: 41.1100, longitude: 66.8300 },
      { stopId: 'al-hakim-stop', stopName: 'Al-Hakim at-Termiziy', order: 2, latitude: 41.1150, longitude: 66.8350 },
      { stopId: 'qoratepa-stop', stopName: 'Qoratepa', order: 3, latitude: 41.1000, longitude: 66.8200 },
      { stopId: 'fayoztepa-stop', stopName: 'Fayoztepa', order: 4, latitude: 41.0850, longitude: 66.8500 },
    ],
  },
];

// Restoranlar
export const termizRestaurants: Restaurant[] = [
  {
    id: 'naqsh',
    name: 'Naqsh Milliy Fast Food',
    cuisineType: ['osh', 'somsa'],
    avgPrice: 20000,
    latitude: 41.1110,
    longitude: 66.8290,
    image: 'https://image.qwenlm.ai/generated-images/0e95b7b3-9308-46e0-a10d-fdb1decd2cfc/_result.png',
    address: 'Termiz sh., Amir Temur ko\'chasi, 15-uy',
    rating: 4.5,
    menuItems: [
      { id: 'naqsh-osh', name: 'Termiz oshi', price: 25000, description: 'Mahalliy usulda tayyorlangan an\'anaviy osh. Sarimsoq va sabzi bilan.' },
      { id: 'naqsh-somsa', name: 'Go\'shtli somsa', price: 15000, description: 'Tandirda pishirilgan go\'shtli somsa. Yupqa xamir va ko\'p go\'sht.' },
      { id: 'naqsh-kokat', name: 'Ko\'katli somsa', price: 12000, description: 'Ko\'katlar va piyoz bilan tayyorlangan vegetarian somsa.' },
      { id: 'naqsh-choy', name: 'Choy (choynak)', price: 5000, description: 'An\'anaviy ko\'k choy.' },
    ],
  },
  {
    id: 'zulayxo',
    name: 'Choyxonai Zulayxo',
    cuisineType: ['kabob', 'lag\'mon', 'osh'],
    avgPrice: 30000,
    latitude: 41.1090,
    longitude: 66.8310,
    image: 'https://image.qwenlm.ai/generated-images/63cae97e-05aa-4fd1-aa12-8060b2b5e41a/_result.png',
    address: 'Termiz sh., Mustaqillik ko\'chasi, 42-uy',
    rating: 4.7,
    menuItems: [
      { id: 'zulayxo-lagmon', name: 'Mol go\'shtli lag\'mon', price: 28000, description: 'Qo\'lda tortilgan uzun noodles, mol go\'shti va sabzavotlar bilan.' },
      { id: 'zulayxo-kabob', name: 'Txayla kabob', price: 35000, description: 'Txayla go\'shtidan tayyorlangan kabob. Maxsus sous bilan.' },
      { id: 'zulayxo-somsa-osh', name: 'Somsa osh', price: 22000, description: 'Somsa va osh kombinatsiyasi. Katta porsiya.' },
      { id: 'zulayxo-mastava', name: 'Mastava', price: 18000, description: 'Suyuq osh, go\'sht va sabzavotlar bilan.' },
      { id: 'zulayxo-ayron', name: 'Ayron', price: 5000, description: 'An\'anaviy sutli ichimlik.' },
    ],
  },
  {
    id: 'al-qasr',
    name: 'Al-Qasr',
    cuisineType: ['shashlik', 'go\'sht'],
    avgPrice: 45000,
    latitude: 41.1130,
    longitude: 66.8340,
    image: 'https://image.qwenlm.ai/generated-images/e46bcdd0-0061-44b7-ab50-cccd2493b70b/_result.png',
    address: 'Termiz sh., Navoiy ko\'chasi, 8-uy',
    rating: 4.8,
    menuItems: [
      { id: 'al-qasr-mol', name: 'Mol go\'sht shashligi', price: 40000, description: 'Premium mol go\'shtidan tayyorlangan shashlik. Ko\'mir ustida pishirilgan.' },
      { id: 'al-qasr-qoy', name: 'Qo\'y go\'sht shashligi', price: 45000, description: 'Yangi qo\'y go\'shti, maxsus marinadda.' },
      { id: 'al-qasr-jigar', name: 'Jigar shashligi', price: 30000, description: 'Mol jigari, piyoz va ziravorlar bilan.' },
      { id: 'al-qasr-tandir', name: 'Tandoor kabob', price: 50000, description: 'Tandirda pishirilgan katta go\'sht bo\'lagi.' },
      { id: 'al-qasr-non', name: 'Non (tandir)', price: 3000, description: 'Tandirda pishirilgan an\'anaviy non.' },
    ],
  },
  {
    id: 'shahzod',
    name: 'Shahzod Nomdor Somsa Osh Markazi',
    cuisineType: ['somsa', 'osh'],
    avgPrice: 18000,
    latitude: 41.1070,
    longitude: 66.8270,
    image: 'https://image.qwenlm.ai/generated-images/dbb9d5fe-8596-415c-a46f-bae872508bd7/_result.png',
    address: 'Termiz sh., Bobur ko\'chasi, 25-uy',
    rating: 4.6,
    menuItems: [
      { id: 'shahzod-qatlama', name: 'Qatlamali somsa', price: 12000, description: 'Yupqa qatlamali xamirda tayyorlangan somsa. Ko\'p go\'sht.' },
      { id: 'shahzod-tandir', name: 'Tandir somsa', price: 15000, description: 'Tandirda pishirilgan katta somsa.' },
      { id: 'shahzod-oddiy', name: 'Oddiy osh', price: 18000, description: 'Klassik o\'zbek oshi. Sarimsoq bilan.' },
      { id: 'shahzod-toy', name: 'To\'y oshi', price: 22000, description: 'Maxsus to\'y oshi. No\'xat, sarimsoq va mayiz bilan.' },
    ],
  },
];

// Termiz agentliklari
export const termizAgencies: Agency[] = [
  {
    id: 'termiz-tur',
    name: 'Termiz Tur',
    description: 'Termiz shahri bo\'ylab professional sayohatlar. Buddaviy meros, tarixiy obidalar va madaniy tajribalar.',
    logo: '🏛️',
    isVerified: true,
    userId: 'u-termiz-1',
    tours: [],
    rating: 4.8,
    reviewCount: 156,
    email: 'info@termiztur.uz',
    phone: '+998 76 225 12 34',
    address: 'Termiz sh., Amir Temur ko\'chasi, 50-uy',
    website: 'www.termiztur.uz',
    establishedYear: 2015,
    languages: ['Uzbek', 'Russian', 'English'],
    specialties: ['Buddaviy meros', 'Arxeologik turlar', 'Tarixiy sayohatlar'],
    workingHours: 'Dushanba - Shanba: 09:00 - 18:00',
    socialMedia: {
      telegram: '@termiz_tur',
      instagram: '@termiz_tur',
    },
    about: 'Termiz Tur 2015-yildan beri Termiz shahri va uning atrofidagi tarixiy joylarga sayohatlar tashkil etib kelmoqda. Bizning jamoamiz mahalliy tarixchilar va professional gidlardan iborat.',
    achievements: [
      'Termizning eng yaxshi tur operatori 2023',
      '5000+ mamnun mehmon',
      'Professional tarixchi gidlar',
    ],
  },
  {
    id: 'silk-road-termiz',
    name: 'Silk Road Termiz',
    description: 'Ipak yo\'li bo\'ylab unutilmas sayohatlar. Termizning qadimiy tarixini kashf eting.',
    logo: '🐫',
    isVerified: true,
    userId: 'u-termiz-2',
    tours: [],
    rating: 4.7,
    reviewCount: 98,
    email: 'info@silkroadtermiz.uz',
    phone: '+998 91 234 56 78',
    address: 'Termiz sh., Mustaqillik ko\'chasi, 25-uy',
    website: 'www.silkroadtermiz.uz',
    establishedYear: 2018,
    languages: ['Uzbek', 'Russian', 'English', 'Chinese'],
    specialties: ['Ipak yo\'li', 'Madaniy turlar', 'Foto turlar'],
    workingHours: 'Har kuni: 08:00 - 20:00',
    socialMedia: {
      telegram: '@silkroad_termiz',
      instagram: '@silkroad_termiz',
    },
    about: 'Silk Road Termiz Ipak yo\'li bo\'ylab sayohatlarga ixtisoslashgan. Biz sizga Termizning qadimiy tarixini va madaniyatini kashf etishga yordam beramiz.',
    achievements: [
      'Xalqaro turizm mukofoti 2022',
      '3000+ sayyoh',
      'Ko\'p tilli gidlar',
    ],
  },
];

// Narx ko'rsatkichlari (Price Indicators)
export const priceIndicators = {
  transport: {
    bus: 2000, // so'm
    minibus: 3000, // so'm
    taxi_start: 5000, // so'm
    taxi_per_km: 1000, // so'm
  },
  food: {
    budget: { min: 15000, max: 25000, description: 'Arzon restoranlar, fast food' },
    mid_range: { min: 25000, max: 40000, description: 'O\'rtacha restoranlar' },
    expensive: { min: 40000, max: 70000, description: 'Qimmat restoranlar' },
  },
  attractions: {
    free: ['Al-Hakim at-Termiziy maqbarasi'],
    budget: { min: 10000, max: 20000, description: 'Arzon kirish haqi' },
    mid_range: { min: 20000, max: 30000, description: 'O\'rtacha kirish haqi' },
  },
  currency: 'UZS (O\'zbek so\'mi)',
  exchange_rate: '1 USD ≈ 12,500 UZS (2026)',
};

// Dinamik sana yaratish helper
export function getDynamicDates() {
  const now = new Date();
  const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 kun keyin
  
  return {
    today: now.toISOString().split('T')[0],
    nextMonth: futureDate.toISOString().split('T')[0],
    formatDate: (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
  };
}
