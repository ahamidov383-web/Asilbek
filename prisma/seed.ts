// prisma/seed.ts
// Bu fayl Next.js loyihasi uchun tayyor seed skript
// React loyihasida faqat documentation uchun ishlatiladi

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Termiz ma\'lumotlarini yuklash boshlandi...\n');

  // ============================================
  // 1. FOYDALANUVCHILAR VA AGENTLIKLAR
  // ============================================
  
  console.log('👤 Foydalanuvchilar yaratilmoqda...');
  
  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@termiz.travel' },
    update: {},
    create: {
      name: 'Termiz Admin',
      email: 'admin@termiz.travel',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin yaratildi:', admin.email);

  // Agency 1: Termiz Tur
  const agencyUser1 = await prisma.user.upsert({
    where: { email: 'termiz.tur@mail.uz' },
    update: {},
    create: {
      name: 'Termiz Tur',
      email: 'termiz.tur@mail.uz',
      password: hashedPassword,
      role: 'AGENCY',
    },
  });

  const agency1 = await prisma.agency.upsert({
    where: { userId: agencyUser1.id },
    update: {},
    create: {
      name: 'Termiz Tur',
      description: 'Termiz shahri bo\'ylab professional sayohatlar. Buddaviy meros, tarixiy obidalar va madaniy tajribalar.',
      logo: '🏛️',
      isVerified: true,
      userId: agencyUser1.id,
    },
  });
  console.log('✅ Agentlik yaratildi:', agency1.name);

  // Agency 2: Silk Road Termiz
  const agencyUser2 = await prisma.user.upsert({
    where: { email: 'silkroad.termiz@mail.uz' },
    update: {},
    create: {
      name: 'Silk Road Termiz',
      email: 'silkroad.termiz@mail.uz',
      password: hashedPassword,
      role: 'AGENCY',
    },
  });

  const agency2 = await prisma.agency.upsert({
    where: { userId: agencyUser2.id },
    update: {},
    create: {
      name: 'Silk Road Termiz',
      description: 'Ipak yo\'li bo\'ylab unutilmas sayohatlar. Termizning qadimiy tarixini kashf eting.',
      logo: '🐫',
      isVerified: true,
      userId: agencyUser2.id,
    },
  });
  console.log('✅ Agentlik yaratildi:', agency2.name);

  // ============================================
  // 2. DIQQATGA SAZOVOR JOYLAR (PLACES)
  // ============================================
  
  console.log('\n🏛️ Diqqatga sazovor joylar yaratilmoqda...');

  const places = [
    {
      name: 'Fayoztepa',
      type: 'Arxeologik',
      description: 'Miloddan avvalgi I asrga oid buddaviy ibodatxona qoldiqlari. Termiz shahridan 12 km janubda joylashgan. Bu yerda buddaviy monastir va stupalar qoldiqlari topilgan.',
      howToGet: 'Shahar markazidan 3-avtobusda "Fayoztepa" bekatigacha, so\'ng 2 km piyoda. Yoki taksi bilan 15-20 daqiqa.',
      workHours: '09:00 - 18:00 (Dushanba - Yakshanba)',
      latitude: 41.0850,
      longitude: 66.8500,
      ticketPrice: '20,000 so\'m',
    },
    {
      name: 'Qoratepa',
      type: 'Arxeologik',
      description: 'Kushon davriga oid qadimiy buddaviy majmua. Milodiy I-III asrlarda qurilgan. Bu yerda buddaviy ibodatxona, monastir va stupalar qoldiqlari saqlangan.',
      howToGet: 'Shahar markazidan 4-avtobusda "Qoratepa" bekatigacha. Yoki taksi bilan 10 daqiqa.',
      workHours: '09:00 - 17:00 (Dushanba - Shanba)',
      latitude: 41.1000,
      longitude: 66.8200,
      ticketPrice: '15,000 so\'m',
    },
    {
      name: 'Termiz Arxeologiya Muzeyi',
      type: 'Muzey',
      description: 'Termiz va uning atrofidagi hududlarning qadimiy tarixiga bag\'ishlangan muzey. Buddaviy davr, Kushon imperiyasi va Ipak yo\'li davriga oid eksponatlar.',
      howToGet: 'Shahar markazida, Istiqlol maydoni yaqinida. 4-avtobusda "Markaz" bekatigacha.',
      workHours: '09:00 - 17:00 (Dushanba - Juma), 10:00 - 15:00 (Shanba)',
      latitude: 41.1100,
      longitude: 66.8300,
      ticketPrice: '25,000 so\'m',
    },
    {
      name: 'Al-Hakim at-Termiziy maqbarasi',
      type: 'Ziyoratgoh',
      description: 'IX asrda yashagan mashhur islom olimi va mutafakkiri Al-Hakim at-Termiziyning maqbarasi. Ziyoratchilar uchun muqaddas joy.',
      howToGet: 'Shahar markazidan 17-marshrutkada "Al-Hakim at-Termiziy" bekatigacha. Yoki taksi bilan 5 daqiqa.',
      workHours: '08:00 - 20:00 (Har kuni)',
      latitude: 41.1150,
      longitude: 66.8350,
      ticketPrice: 'Bepul',
    },
    {
      name: 'Sulton Saodat majmuasi',
      type: 'Me\'moriy yodgorlik',
      description: 'IX-XII asrlarga oid me\'moriy majmua. Termizdan 20 km janubda joylashgan. Sayyidlar avlodining dafn etilgan joyi.',
      howToGet: 'Shahar markazidan taksi bilan 25-30 daqiqa. Jamoat transporti yo\'q.',
      workHours: '08:00 - 18:00 (Har kuni)',
      latitude: 41.0500,
      longitude: 66.8000,
      ticketPrice: '10,000 so\'m',
    },
  ];

  for (const place of places) {
    await prisma.place.upsert({
      where: { id: place.name.toLowerCase().replace(/\s+/g, '-') },
      update: place,
      create: {
        id: place.name.toLowerCase().replace(/\s+/g, '-'),
        ...place,
      },
    });
    console.log('✅ Joy qo\'shildi:', place.name);
  }

  // ============================================
  // 3. TRANSPORT YO'NALISHLARI VA BEKATLAR
  // ============================================
  
  console.log('\n🚌 Transport yo\'nalishlari yaratilmoqda...');

  // Bus stops
  const busStops = [
    { name: 'Yashil dunyo bozor', latitude: 41.1120, longitude: 66.8280 },
    { name: 'Termiz Avtostansiyasi', latitude: 41.1200, longitude: 66.8400 },
    { name: 'Markaziy bank bekati', latitude: 41.1100, longitude: 66.8300 },
    { name: 'Istiqlol maydoni', latitude: 41.1080, longitude: 66.8320 },
    { name: 'Manguzar', latitude: 41.0950, longitude: 66.8150 },
    { name: 'Vokzal', latitude: 41.1250, longitude: 66.8450 },
    { name: 'Fayoztepa', latitude: 41.0850, longitude: 66.8500 },
    { name: 'Qoratepa', latitude: 41.1000, longitude: 66.8200 },
    { name: 'Al-Hakim at-Termiziy', latitude: 41.1150, longitude: 66.8350 },
  ];

  const createdStops: any[] = [];
  for (const stop of busStops) {
    const created = await prisma.busStop.upsert({
      where: { id: stop.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: stop.name.toLowerCase().replace(/\s+/g, '-'),
        ...stop,
      },
    });
    createdStops.push(created);
    console.log('✅ Bekat qo\'shildi:', stop.name);
  }

  // Transport routes
  const routes = [
    {
      name: '3-avtobus',
      type: 'bus',
      from: 'Istiqlol maydoni',
      to: 'Manguzar',
      price: 2000,
      stops: ['Istiqlol maydoni', 'Markaziy bank bekati', 'Yashil dunyo bozor', 'Manguzar'],
    },
    {
      name: '4-avtobus',
      type: 'bus',
      from: 'Vokzal',
      to: 'Markaz',
      price: 2000,
      stops: ['Vokzal', 'Termiz Avtostansiyasi', 'Markaziy bank bekati', 'Istiqlol maydoni'],
    },
    {
      name: '17-marshrutka',
      type: 'minibus',
      from: 'Markaziy bank bekati',
      to: 'Al-Hakim at-Termiziy',
      price: 3000,
      stops: ['Markaziy bank bekati', 'Al-Hakim at-Termiziy', 'Qoratepa', 'Fayoztepa'],
    },
  ];

  for (const route of routes) {
    const createdRoute = await prisma.transportRoute.upsert({
      where: { id: route.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: route.name.toLowerCase().replace(/\s+/g, '-'),
        name: route.name,
        type: route.type,
        from: route.from,
        to: route.to,
        price: route.price,
      },
    });
    console.log('✅ Yo\'nalish qo\'shildi:', route.name);

    // Link stops to route
    for (let i = 0; i < route.stops.length; i++) {
      const stopName = route.stops[i];
      const stop = createdStops.find(s => s.name === stopName);
      if (stop) {
        await prisma.routeStop.upsert({
          where: {
            routeId_stopId: {
              routeId: createdRoute.id,
              stopId: stop.id,
            },
          },
          update: {},
          create: {
            routeId: createdRoute.id,
            stopId: stop.id,
            order: i + 1,
          },
        });
      }
    }
  }

  // ============================================
  // 4. RESTORANLAR VA MENYU
  // ============================================
  
  console.log('\n🍽️ Restoranlar yaratilmoqda...');

  const restaurants = [
    {
      name: 'Naqsh Milliy Fast Food',
      cuisineType: ['osh', 'somsa'],
      avgPrice: 20000,
      latitude: 41.1110,
      longitude: 66.8290,
      address: 'Termiz sh., Amir Temur ko\'chasi, 15-uy',
      menuItems: [
        { name: 'Termiz oshi', price: 25000, description: 'Mahalliy usulda tayyorlangan an\'anaviy osh. Sarimsoq va sabzi bilan.' },
        { name: 'Go\'shtli somsa', price: 15000, description: 'Tandirda pishirilgan go\'shtli somsa. Yupqa xamir va ko\'p go\'sht.' },
        { name: 'Ko\'katli somsa', price: 12000, description: 'Ko\'katlar va piyoz bilan tayyorlangan vegetarian somsa.' },
        { name: 'Choy (choynak)', price: 5000, description: 'An\'anaviy ko\'k choy.' },
      ],
    },
    {
      name: 'Choyxonai Zulayxo',
      cuisineType: ['kabob', 'lag\'mon', 'osh'],
      avgPrice: 30000,
      latitude: 41.1090,
      longitude: 66.8310,
      address: 'Termiz sh., Mustaqillik ko\'chasi, 42-uy',
      menuItems: [
        { name: 'Mol go\'shtli lag\'mon', price: 28000, description: 'Qo\'lda tortilgan uzun noodles, mol go\'shti va sabzavotlar bilan.' },
        { name: 'Txayla kabob', price: 35000, description: 'Txayla go\'shtidan tayyorlangan kabob. Maxsus sous bilan.' },
        { name: 'Somsa osh', price: 22000, description: 'Somsa va osh kombinatsiyasi. Katta porsiya.' },
        { name: 'Mastava', price: 18000, description: 'Suyuq osh, go\'sht va sabzavotlar bilan.' },
        { name: 'Ayron', price: 5000, description: 'An\'anaviy sutli ichimlik.' },
      ],
    },
    {
      name: 'Al-Qasr',
      cuisineType: ['shashlik', 'go\'sht'],
      avgPrice: 45000,
      latitude: 41.1130,
      longitude: 66.8340,
      address: 'Termiz sh., Navoiy ko\'chasi, 8-uy',
      menuItems: [
        { name: 'Mol go\'sht shashligi', price: 40000, description: 'Premium mol go\'shtidan tayyorlangan shashlik. Ko\'mir ustida pishirilgan.' },
        { name: 'Qo\'y go\'sht shashligi', price: 45000, description: 'Yangi qo\'y go\'shti, maxsus marinadda.' },
        { name: 'Jigar shashligi', price: 30000, description: 'Mol jigari, piyoz va ziravorlar bilan.' },
        { name: 'Tandoor kabob', price: 50000, description: 'Tandirda pishirilgan katta go\'sht bo\'lagi.' },
        { name: 'Non (tandir)', price: 3000, description: 'Tandirda pishirilgan an\'anaviy non.' },
      ],
    },
    {
      name: 'Shahzod Nomdor Somsa Osh Markazi',
      cuisineType: ['somsa', 'osh'],
      avgPrice: 18000,
      latitude: 41.1070,
      longitude: 66.8270,
      address: 'Termiz sh., Bobur ko\'chasi, 25-uy',
      menuItems: [
        { name: 'Qatlamali somsa', price: 12000, description: 'Yupqa qatlamali xamirda tayyorlangan somsa. Ko\'p go\'sht.' },
        { name: 'Tandir somsa', price: 15000, description: 'Tandirda pishirilgan katta somsa.' },
        { name: 'Oddiy osh', price: 18000, description: 'Klassik o\'zbek oshi. Sarimsoq bilan.' },
        { name: 'To\'y oshi', price: 22000, description: 'Maxsus to\'y oshi. No\'xat, sarimsoq va mayiz bilan.' },
      ],
    },
  ];

  for (const restaurant of restaurants) {
    const { menuItems, ...rest } = restaurant;
    const createdRestaurant = await prisma.restaurant.upsert({
      where: { id: restaurant.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: restaurant.name.toLowerCase().replace(/\s+/g, '-'),
        ...rest,
      },
    });
    console.log('✅ Restoran qo\'shildi:', restaurant.name);

    // Add menu items
    for (const item of menuItems) {
      await prisma.menuItem.upsert({
        where: { id: `${createdRestaurant.id}-${item.name.toLowerCase().replace(/\s+/g, '-')}` },
        update: {},
        create: {
          id: `${createdRestaurant.id}-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
          ...item,
          restaurantId: createdRestaurant.id,
        },
      });
    }
  }

  console.log('\n✅ Barcha ma\'lumotlar muvaffaqiyatli yuklandi!\n');
}

main()
  .catch((e) => {
    console.error('❌ Xatolik yuz berdi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
