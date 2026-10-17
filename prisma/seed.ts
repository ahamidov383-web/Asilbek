import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Ma\'lumotlar bazasini to\'ldirish boshlandi...\n');

  // ============================================
  // 1. JOYLAR (PLACES)
  // ============================================
  
  console.log('📍 Joylar yaratilmoqda...');

  const places = [
    {
      id: 'fayoztepa',
      name_uz: 'Fayoztepa',
      name_ru: 'Фаязтепа',
      name_en: 'Fayaztepa Buddhist Site',
      description_uz: 'Qadimiy buddaviy ibodatxona. Miloddan avvalgi I asrda qurilgan. Bu yerda buddaviy monastir va stupalar qoldiqlari topilgan.',
      description_ru: 'Древний буддийский храм. Построен в I веке до н.э. Здесь обнаружены остатки буддийского монастыря и ступ.',
      description_en: 'Ancient Buddhist temple. Built in the 1st century BC. Remains of a Buddhist monastery and stupas were found here.',
      howToGet_uz: '45-avtobusda "Fayoztepa" bekatigacha, so\'ng 2 km piyoda. Yoki taksi bilan 15-20 daqiqa.',
      howToGet_ru: 'На автобусе 45 до остановки "Фаязтепа", затем 2 км пешком. Или на такси 15-20 минут.',
      howToGet_en: 'By bus 45 to "Fayaztepa" stop, then 2 km walk. Or by taxi 15-20 minutes.',
      type: 'Tarixiy yodgorlik',
      workHours: '09:00 - 18:00 (Dushanba - Yakshanba)',
      latitude: 41.0850,
      longitude: 66.8500,
      ticketPrice: '20,000 so\'m',
    },
    {
      id: 'qoratepa',
      name_uz: 'Qoratepa',
      name_ru: 'Кара-тепа',
      name_en: 'Kara-tepa',
      description_uz: 'Kushon davriga oid qadimiy buddaviy majmua. Milodiy I-III asrlarda qurilgan.',
      description_ru: 'Древний буддийский комплекс эпохи Кушан. Построен в I-III вв. н.э.',
      description_en: 'Ancient Buddhist complex from the Kushan era. Built in the 1st-3rd centuries AD.',
      howToGet_uz: 'Shahar markazidan 4-avtobusda "Qoratepa" bekatigacha.',
      howToGet_ru: 'От центра города на 4-автобусе до остановки "Кара-тепа".',
      howToGet_en: 'From city center by bus #4 to "Kara-tepa" stop.',
      type: 'Arxeologik',
      workHours: '09:00 - 17:00 (Dushanba - Shanba)',
      latitude: 41.1000,
      longitude: 66.8200,
      ticketPrice: '15,000 so\'m',
    },
    {
      id: 'al-hakim-at-termiziy',
      name_uz: 'Al-Hakim at-Termiziy maqbarasi',
      name_ru: 'Мавзолей Аль-Хакима ат-Термизи',
      name_en: 'Al-Hakim al-Termezi Mausoleum',
      description_uz: 'IX asrda yashagan mashhur islom olimi va mutafakkiri Al-Hakim at-Termiziyning maqbarasi.',
      description_ru: 'Мавзолей известного исламского ученого и мыслителя IX века Аль-Хакима ат-Термизи.',
      description_en: 'Mausoleum of famous Islamic scholar and thinker of the 9th century Al-Hakim al-Termezi.',
      howToGet_uz: 'Shahar markazidan 17-marshrutkada "Al-Hakim" bekatigacha.',
      howToGet_ru: 'От центра города на 17-маршрутке до остановки "Аль-Хаким".',
      howToGet_en: 'From city center by minibus #17 to "Al-Hakim" stop.',
      type: 'Ziyoratgoh',
      workHours: '08:00 - 20:00 (Har kuni)',
      latitude: 41.1150,
      longitude: 66.8350,
      ticketPrice: 'Bepul',
    },
  ];

  for (const place of places) {
    await prisma.place.upsert({
      where: { id: place.id },
      update: place,
      create: place,
    });
    console.log(`✅ ${place.name_uz} qo'shildi`);
  }

  // ============================================
  // 2. RESTORANLAR (RESTAURANTS)
  // ============================================
  
  console.log('\n🍽️ Restoranlar yaratilmoqda...');

  const restaurants = [
    {
      id: 'naqsh',
      name_uz: 'Naqsh Milliy Fast Food',
      name_ru: 'Накш Национальный Фаст Фуд',
      name_en: 'Naqsh National Fast Food',
      description_uz: 'Milliy taomlar tez tayyorlanadigan restoran. O\'zbek oshini tatib ko\'ring.',
      description_ru: 'Ресторан быстрого питания с национальными блюдами. Попробуйте узбекский плов.',
      description_en: 'Fast food restaurant with national dishes. Taste Uzbek plov.',
      cuisineType: ['osh', 'somsa'],
      avgPrice: 20000,
      latitude: 41.1110,
      longitude: 66.8290,
      address: 'Termiz sh., Amir Temur ko\'chasi, 15-uy',
      menuItems: {
        create: [
          {
            id: 'naqsh-osh',
            name_uz: 'Termiz oshi',
            name_ru: 'Термезский плов',
            name_en: 'Termiz Plov',
            description_uz: 'An\'anaviy o\'zbek oshi. Sarimsoq va sabzi bilan.',
            description_ru: 'Традиционный узбекский плов. С чесноком и морковью.',
            description_en: 'Traditional Uzbek plov. With garlic and carrots.',
            price: 25000,
          },
          {
            id: 'naqsh-somsa',
            name_uz: 'Go\'shtli somsa',
            name_ru: 'Самса с мясом',
            name_en: 'Meat Samsa',
            description_uz: 'Tandirda pishirilgan somsa. Yupqa xamir va ko\'p go\'sht.',
            description_ru: 'Самса из тандыра. Тонкое тесто и много мяса.',
            description_en: 'Samsa from tandoor. Thin dough and lots of meat.',
            price: 15000,
          },
        ],
      },
    },
    {
      id: 'al-qasr',
      name_uz: 'Al-Qasr',
      name_ru: 'Аль-Каср',
      name_en: 'Al-Qasr',
      description_uz: 'Shashlik va go\'sht taomlari. Premium sifat.',
      description_ru: 'Шашлык и мясные блюда. Премиум качество.',
      description_en: 'Shashlik and meat dishes. Premium quality.',
      cuisineType: ['shashlik', 'go\'sht'],
      avgPrice: 45000,
      latitude: 41.1130,
      longitude: 66.8340,
      address: 'Termiz sh., Navoiy ko\'chasi, 8-uy',
      menuItems: {
        create: [
          {
            id: 'al-qasr-mol',
            name_uz: 'Mol go\'sht shashligi',
            name_ru: 'Шашлык из говядины',
            name_en: 'Beef Shashlik',
            description_uz: 'Premium mol go\'shtidan tayyorlangan shashlik.',
            description_ru: 'Шашлык из премиальной говядины.',
            description_en: 'Shashlik made from premium beef.',
            price: 40000,
          },
          {
            id: 'al-qasr-qoy',
            name_uz: 'Qo\'y go\'sht shashligi',
            name_ru: 'Шашлык из баранины',
            name_en: 'Lamb Shashlik',
            description_uz: 'Yangi qo\'y go\'shti, maxsus marinadda.',
            description_ru: 'Свежая баранина в специальном маринаде.',
            description_en: 'Fresh lamb in special marinade.',
            price: 45000,
          },
        ],
      },
    },
  ];

  for (const restaurant of restaurants) {
    const { menuItems, ...rest } = restaurant;
    
    await prisma.restaurant.upsert({
      where: { id: restaurant.id },
      update: rest,
      create: {
        ...rest,
        menuItems,
      },
    });
    console.log(`✅ ${restaurant.name_uz} qo'shildi`);
  }

  console.log('\n✅ Barcha ma\'lumotlar muvaffaqiyatli yuklandi!');
}

main()
  .catch((e) => {
    console.error('❌ Xatolik:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
