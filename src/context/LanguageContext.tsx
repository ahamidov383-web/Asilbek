import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';

// Tarjimalar to'g'ridan-to'g'ri TypeScript obyekt sifatida
const messages = {
  uz: {
    home: {
      title: "O'zbekiston bo'ylab sayohat",
      hero: "Markaziy Osiyoning yuragini kashf eting",
      heroSub: "Qadimiy Ipak Yo'li shaharlarini o'rganing, haqiqiy taomlarni tatib ko'ring va O'zbekistonda unutilmas xotiralar yarating",
      exploreTours: "Turlarni ko'rish",
      findAgencies: "Agentliklarni topish",
      explorePlaces: "Obyektlarni ko'rish",
      findRestaurants: "Restoran topish",
      browseTours: "Turlarni ko'rish",
      stats: {
        tours: "Mavjud turlar",
        agencies: "Tasdiqlangan agentliklar",
        places: "Tarixiy joylar",
        tourists: "Mamnun sayyohlar"
      },
      popularTitle: "Mashhur yo'nalishlar",
      popularSub: "O'zbekistonning eng ko'p tashrif buyuriladigan joylarini kashf eting",
      whyTitle: "Nega O'zbekiston?",
      whySub: "Qadimiy mo'jizalar va iliq mehmondo'stlik yurti",
      features: {
        culture: "Boy madaniyat",
        cultureDesc: "Ipak yo'li bo'ylab 2000+ yillik tarix",
        food: "Ajoyib taomlar",
        foodDesc: "Haqiqiy osh, shashlik va 1000+ taom",
        safety: "Xavfsiz va mehmondo'st",
        safetyDesc: "Markaziy Osiyodagi eng xavfsiz mamlakatlardan biri",
        value: "Arzon narxlar",
        valueDesc: "Dunyo darajasidagi tajribalar hamyonbop narxlarda"
      },
      heroSection: {
        title: "Buyuk Ipak Yo'li bo'ylab sayohat",
        subtitle: "Qadimiy shaharlarni kashf eting"
      }
    },
    places: {
      title: "Diqqatga sazovor joylar",
      subtitle: "O'zbekistonning boy merosini o'rganing",
      howToGet: "Qanday borish mumkin",
      workHours: "Ish vaqti",
      ticketPrice: "Chipta narxi",
      search: "Joylarni qidirish...",
      allTypes: "Barcha turlar",
      viewMap: "Xaritada ko'rish"
    },
    restaurants: {
      title: "Restoranlar va taomlar",
      subtitle: "O'zbekistonning mazali taomlarini tatib ko'ring",
      searchFood: "Taom turini qidirish...",
      avgPrice: "O'rtacha narx",
      perPerson: "bir kishi uchun",
      menu: "Menyu",
      cuisine: "Oshxona"
    },
    tours: {
      title: "Mavjud turlar",
      subtitle: "O'zingizga mos sarguzashtni toping",
      seats: "joy qoldi",
      book: "Band qilish",
      details: "Batafsil",
      filter: "Filtr",
      priceRange: "Narx oralig'i",
      search: "Turlarni qidirish...",
      full: "Joy yo'q"
    },
    agencies: {
      title: "Tasdiqlangan sayyohlik agentliklari",
      subtitle: "Ishonchli mahalliy mutaxassislar bilan bog'laning",
      verified: "Tasdiqlangan",
      tours: "turlar",
      reviews: "sharhlar",
      viewProfile: "Profilni ko'rish",
      search: "Agentliklarni qidirish..."
    },
    request: {
      title: "Individual tur so'rash",
      subtitle: "Orzuyingizdagi sayohat haqida ayting va agentliklar sizga takliflar yuboradi",
      budget: "Byudjet (USD)",
      interests: "Qiziqishlar",
      interestsPlaceholder: "masalan., Tarix, Taom, Tabiat, Sarguzasht...",
      startDate: "Boshlanish sanasi",
      endDate: "Tugash sanasi",
      submit: "So'rov yuborish",
      success: "So'rovingiz yuborildi! Agentliklar ko'rib chiqadi va takliflar yuboradi."
    },
    dashboard: {
      title: "Agentlik kabineti",
      tours: "Mening turlarim",
      requests: "Kiruvchi so'rovlar",
      offers: "Mening takliflarim",
      addTour: "Tur qo'shish",
      updateSeats: "Joylarni yangilash",
      sendOffer: "Taklif yuborish",
      stats: {
        totalTours: "Jami turlar",
        activeBookings: "Faol bandlovlar",
        totalRevenue: "Jami daromad",
        avgRating: "O'rt. reyting"
      }
    },
    admin: {
      title: "Admin paneli",
      agencies: "Agentliklarni tekshirish",
      content: "Kontent moderatsiyasi",
      users: "Foydalanuvchilar",
      approve: "Tasdiqlash",
      reject: "Rad etish",
      pending: "Kutilmoqda",
      verified: "Tasdiqlangan"
    },
    nav: {
      home: "Bosh sahifa",
      agencies: "Agentliklar",
      tours: "Turlar",
      places: "Joylar",
      restaurants: "Restoranlar",
      request: "Tur so'rash",
      dashboard: "Kabinet",
      admin: "Admin",
      login: "Kirish",
      logout: "Chiqish"
    },
    footer: {
      about: "Biz haqimizda",
      contact: "Aloqa",
      privacy: "Maxfiylik siyosati",
      terms: "Foydalanish shartlari",
      copyright: "© 2026 Visit Uzbekistan. Barcha huquqlar himoyalangan."
    },
    common: {
      loading: "Yuklanmoqda...",
      error: "Xatolik yuz berdi",
      back: "Orqaga",
      save: "Saqlash",
      cancel: "Bekor qilish",
      close: "Yopish",
      perPerson: "bir kishi uchun",
      usd: "USD"
    }
  },
  ru: {
    home: {
      title: "Путешествие по Узбекистану",
      hero: "Откройте сердце Центральной Азии",
      heroSub: "Исследуйте древние города Шёлкового пути, попробуйте настоящую кухню и создайте незабываемые воспоминания в Узбекистане",
      exploreTours: "Смотреть туры",
      findAgencies: "Найти агентства",
      explorePlaces: "Смотреть достопримечательности",
      findRestaurants: "Найти рестораны",
      browseTours: "Смотреть туры",
      stats: {
        tours: "Доступных туров",
        agencies: "Проверенных агентств",
        places: "Исторических мест",
        tourists: "Довольных туристов"
      },
      popularTitle: "Популярные направления",
      popularSub: "Откройте самые посещаемые места Узбекистана",
      whyTitle: "Почему Узбекистан?",
      whySub: "Земля древних чудес и тёплого гостеприимства",
      features: {
        culture: "Богатая культура",
        cultureDesc: "2000+ лет истории вдоль Шёлкового пути",
        food: "Невероятная еда",
        foodDesc: "Настоящий плов, шашлык и 1000+ блюд",
        safety: "Безопасно и приветливо",
        safetyDesc: "Одна из самых безопасных стран Центральной Азии",
        value: "Отличная цена",
        valueDesc: "Мирового класса опыт по доступным ценам"
      },
      heroSection: {
        title: "Путешествие по Великому Шёлковому пути",
        subtitle: "Откройте древние города"
      }
    },
    places: {
      title: "Исторические места и достопримечательности",
      subtitle: "Исследуйте богатое наследие Узбекистана",
      howToGet: "Как добраться",
      workHours: "Часы работы",
      ticketPrice: "Стоимость билета",
      search: "Поиск мест...",
      allTypes: "Все типы",
      viewMap: "На карте"
    },
    restaurants: {
      title: "Рестораны и еда",
      subtitle: "Попробуйте вкусы Узбекистана",
      searchFood: "Поиск по типу еды...",
      avgPrice: "Средняя цена",
      perPerson: "на человека",
      menu: "Меню",
      cuisine: "Кухня"
    },
    tours: {
      title: "Доступные туры",
      subtitle: "Найдите своё идеальное приключение",
      seats: "мест осталось",
      book: "Забронировать",
      details: "Подробнее",
      filter: "Фильтр",
      priceRange: "Диапазон цен",
      search: "Поиск туров...",
      full: "Мест нет"
    },
    agencies: {
      title: "Проверенные туристические агентства",
      subtitle: "Свяжитесь с проверенными местными экспертами",
      verified: "Проверено",
      tours: "туров",
      reviews: "отзывов",
      viewProfile: "Смотреть профиль",
      search: "Поиск агентств..."
    },
    request: {
      title: "Заказать индивидуальный тур",
      subtitle: "Расскажите о поездке мечты, и агентства пришлют вам предложения",
      budget: "Бюджет (USD)",
      interests: "Интересы",
      interestsPlaceholder: "напр., История, Еда, Природа, Приключения...",
      startDate: "Дата начала",
      endDate: "Дата окончания",
      submit: "Отправить запрос",
      success: "Ваш запрос отправлен! Агентства рассмотрят и пришлют предложения."
    },
    dashboard: {
      title: "Кабинет агентства",
      tours: "Мои туры",
      requests: "Входящие запросы",
      offers: "Мои предложения",
      addTour: "Добавить тур",
      updateSeats: "Обновить места",
      sendOffer: "Отправить предложение",
      stats: {
        totalTours: "Всего туров",
        activeBookings: "Активные бронирования",
        totalRevenue: "Общий доход",
        avgRating: "Ср. рейтинг"
      }
    },
    admin: {
      title: "Панель администратора",
      agencies: "Проверка агентств",
      content: "Модерация контента",
      users: "Управление пользователями",
      approve: "Одобрить",
      reject: "Отклонить",
      pending: "Ожидание",
      verified: "Проверено"
    },
    nav: {
      home: "Главная",
      agencies: "Агентства",
      tours: "Туры",
      places: "Места",
      restaurants: "Рестораны",
      request: "Заказать тур",
      dashboard: "Кабинет",
      admin: "Админ",
      login: "Войти",
      logout: "Выйти"
    },
    footer: {
      about: "О нас",
      contact: "Контакты",
      privacy: "Политика конфиденциальности",
      terms: "Условия использования",
      copyright: "© 2026 Visit Uzbekistan. Все права защищены."
    },
    common: {
      loading: "Загрузка...",
      error: "Что-то пошло не так",
      back: "Назад",
      save: "Сохранить",
      cancel: "Отмена",
      close: "Закрыть",
      perPerson: "на человека",
      usd: "USD"
    }
  },
  en: {
    home: {
      title: "Travel across Uzbekistan",
      hero: "Discover the Heart of Central Asia",
      heroSub: "Explore ancient Silk Road cities, taste authentic cuisine, and create unforgettable memories in Uzbekistan",
      exploreTours: "Explore Tours",
      findAgencies: "Find Agencies",
      explorePlaces: "Explore Places",
      findRestaurants: "Find Restaurants",
      browseTours: "Browse Tours",
      stats: {
        tours: "Tours Available",
        agencies: "Verified Agencies",
        places: "Historical Sites",
        tourists: "Happy Tourists"
      },
      popularTitle: "Popular Destinations",
      popularSub: "Discover the most visited places in Uzbekistan",
      whyTitle: "Why Choose Uzbekistan?",
      whySub: "A land of ancient wonders and warm hospitality",
      features: {
        culture: "Rich Culture",
        cultureDesc: "2000+ years of history along the Silk Road",
        food: "Incredible Food",
        foodDesc: "Authentic plov, shashlik, and 1000+ dishes",
        safety: "Safe & Welcoming",
        safetyDesc: "One of the safest countries in Central Asia",
        value: "Great Value",
        valueDesc: "World-class experiences at affordable prices"
      },
      heroSection: {
        title: "Journey along the Great Silk Road",
        subtitle: "Discover ancient cities"
      }
    },
    places: {
      title: "Historical Places & Attractions",
      subtitle: "Explore Uzbekistan's rich heritage",
      howToGet: "How to Get There",
      workHours: "Working Hours",
      ticketPrice: "Ticket Price",
      search: "Search places...",
      allTypes: "All Types",
      viewMap: "View on Map"
    },
    restaurants: {
      title: "Restaurants & Food",
      subtitle: "Taste the flavors of Uzbekistan",
      searchFood: "Search by food type...",
      avgPrice: "Average Price",
      perPerson: "per person",
      menu: "Menu",
      cuisine: "Cuisine"
    },
    tours: {
      title: "Available Tours",
      subtitle: "Find your perfect adventure",
      seats: "seats left",
      book: "Book Now",
      details: "View Details",
      filter: "Filter",
      priceRange: "Price Range",
      search: "Search tours...",
      full: "Fully Booked"
    },
    agencies: {
      title: "Verified Travel Agencies",
      subtitle: "Connect with trusted local experts",
      verified: "Verified",
      tours: "tours",
      reviews: "reviews",
      viewProfile: "View Profile",
      search: "Search agencies..."
    },
    request: {
      title: "Request a Custom Tour",
      subtitle: "Tell us about your dream trip and agencies will send you offers",
      budget: "Budget (USD)",
      interests: "Interests",
      interestsPlaceholder: "e.g., History, Food, Nature, Adventure...",
      startDate: "Start Date",
      endDate: "End Date",
      submit: "Submit Request",
      success: "Your request has been submitted! Agencies will review and send offers."
    },
    dashboard: {
      title: "Agency Dashboard",
      tours: "My Tours",
      requests: "Incoming Requests",
      offers: "My Offers",
      addTour: "Add New Tour",
      updateSeats: "Update Seats",
      sendOffer: "Send Offer",
      stats: {
        totalTours: "Total Tours",
        activeBookings: "Active Bookings",
        totalRevenue: "Total Revenue",
        avgRating: "Avg Rating"
      }
    },
    admin: {
      title: "Admin Panel",
      agencies: "Agency Verification",
      content: "Content Moderation",
      users: "User Management",
      approve: "Approve",
      reject: "Reject",
      pending: "Pending",
      verified: "Verified"
    },
    nav: {
      home: "Home",
      agencies: "Agencies",
      tours: "Tours",
      places: "Places",
      restaurants: "Restaurants",
      request: "Request Tour",
      dashboard: "Dashboard",
      admin: "Admin",
      login: "Login",
      logout: "Logout"
    },
    footer: {
      about: "About Us",
      contact: "Contact",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      copyright: "© 2026 Visit Uzbekistan. All rights reserved."
    },
    common: {
      loading: "Loading...",
      error: "Something went wrong",
      back: "Back",
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      perPerson: "per person",
      usd: "USD"
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // LocalStorage'dan tilni o'qish
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      if (saved === 'uz' || saved === 'ru' || saved === 'en') {
        return saved as Language;
      }
    }
    return 'uz';
  });

  // Til o'zgarganda localStorage'ga saqlash
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = messages[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback: agar tarjima topilmasa, kalitni qaytarish
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

/**
 * next-intl'ga o'xshash useTranslations hook
 * 
 * @example
 * const t = useTranslations('home');
 * <button>{t('explorePlaces')}</button>
 */
export function useTranslations(namespace: string) {
  const { t } = useLanguage();
  
  return (key: string): string => {
    return t(`${namespace}.${key}`);
  };
}
