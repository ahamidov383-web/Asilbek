import { Language } from './types';

/**
 * Ko'p tilli ma'lumotlarni olish uchun helper funksiyalar
 */

// Place uchun tarjima olish
export function getPlaceTranslation(place: any, lang: Language) {
  const suffix = `_${lang}`;
  return {
    name: place[`name${suffix}`] || place.name_uz || place.name_en || '',
    description: place[`description${suffix}`] || place.description_uz || place.description_en || '',
    howToGet: place[`howToGet${suffix}`] || place.howToGet_uz || place.howToGet_en || '',
  };
}

// Restaurant uchun tarjima olish
export function getRestaurantTranslation(restaurant: any, lang: Language) {
  const suffix = `_${lang}`;
  return {
    name: restaurant[`name${suffix}`] || restaurant.name_uz || restaurant.name_en || '',
    address: restaurant[`address${suffix}`] || restaurant.address_uz || restaurant.address_en || '',
  };
}

// MenuItem uchun tarjima olish
export function getMenuItemTranslation(menuItem: any, lang: Language) {
  const suffix = `_${lang}`;
  return {
    name: menuItem[`name${suffix}`] || menuItem.name_uz || menuItem.name_en || '',
    description: menuItem[`description${suffix}`] || menuItem.description_uz || menuItem.description_en || '',
  };
}

// Agency uchun tarjima olish
export function getAgencyTranslation(agency: any, lang: Language) {
  const suffix = `_${lang}`;
  return {
    name: agency[`name${suffix}`] || agency.name_uz || agency.name_en || '',
    description: agency[`description${suffix}`] || agency.description_uz || agency.description_en || '',
  };
}

// Tour uchun tarjima olish
export function getTourTranslation(tour: any, lang: Language) {
  const suffix = `_${lang}`;
  return {
    title: tour[`title${suffix}`] || tour.title_uz || tour.title_en || '',
    description: tour[`description${suffix}`] || tour.description_uz || tour.description_en || '',
  };
}

// Generic tarjima funksiyasi
export function getTranslation(obj: any, field: string, lang: Language): string {
  const suffix = `_${lang}`;
  return obj[`${field}${suffix}`] || obj[`${field}_uz`] || obj[`${field}_en`] || '';
}
