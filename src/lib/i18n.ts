/**
 * Ko'p tilli ma'lumotlarni olish uchun helper funksiyalar
 * Next.js next-intl o'rniga React LanguageContext bilan ishlaydi
 */

import { Language } from './types';

/**
 * Next.js getLocalizedField funksiyasining React versiyasi
 * Server-side emas, balki client-side da ishlaydi
 * 
 * @example
 * const name = getLocalizedField(place, 'name', language);
 * // yoki
 * const description = getLocalizedField(place, 'description', language);
 */
export function getLocalizedField<T extends Record<string, any>>(
  item: T,
  fieldBase: string,
  lang: Language
): string {
  const fieldName = `${fieldBase}_${lang}` as keyof T;
  return (item[fieldName] as string) || (item[`${fieldBase}_uz`] as string) || '';
}

/**
 * Next.js getLocalizedObject funksiyasining React versiyasi
 * Ko'p maydonlarni bir vaqtda tarjima qilish
 * 
 * @example
 * const fields = getLocalizedObject(place, ['name', 'description', 'howToGet'], language);
 * // fields.name, fields.description, fields.howToGet
 */
export function getLocalizedObject<T extends Record<string, any>>(
  item: T,
  fields: string[],
  lang: Language
): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const field of fields) {
    result[field] = getLocalizedField(item, field, lang);
  }
  
  return result;
}

// ============================================
// QULAY WRAPPER FUNKSIYALAR
// ============================================

/**
 * Place uchun barcha tarjimalarni olish
 */
export function getPlaceTranslation(place: any, lang: Language) {
  return getLocalizedObject(place, ['name', 'description', 'howToGet'], lang);
}

/**
 * Restaurant uchun barcha tarjimalarni olish
 */
export function getRestaurantTranslation(restaurant: any, lang: Language) {
  return getLocalizedObject(restaurant, ['name', 'description'], lang);
}

/**
 * MenuItem uchun barcha tarjimalarni olish
 */
export function getMenuItemTranslation(menuItem: any, lang: Language) {
  return getLocalizedObject(menuItem, ['name', 'description'], lang);
}

/**
 * Agency uchun barcha tarjimalarni olish
 */
export function getAgencyTranslation(agency: any, lang: Language) {
  return getLocalizedObject(agency, ['name', 'description'], lang);
}

/**
 * Tour uchun barcha tarjimalarni olish
 */
export function getTourTranslation(tour: any, lang: Language) {
  return getLocalizedObject(tour, ['title', 'description'], lang);
}

/**
 * Generic tarjima funksiyasi (bitta maydon uchun)
 */
export function getTranslation(obj: any, field: string, lang: Language): string {
  return getLocalizedField(obj, field, lang);
}

/**
 * Restoran menyu elementlarini tarjima qilish
 * Next.js Promise.all versiyasining React versiyasi
 */
export function translateMenuItems(menuItems: any[], lang: Language) {
  return menuItems.map(item => ({
    ...item,
    name: getLocalizedField(item, 'name', lang),
    description: getLocalizedField(item, 'description', lang),
  }));
}

/**
 * Obyektlar ro'yxatini tarjima qilish
 */
export function translatePlaces(places: any[], lang: Language) {
  return places.map(place => ({
    ...place,
    name: getLocalizedField(place, 'name', lang),
    description: getLocalizedField(place, 'description', lang),
    howToGet: getLocalizedField(place, 'howToGet', lang),
  }));
}

/**
 * Restoranlar ro'yxatini tarjima qilish
 */
export function translateRestaurants(restaurants: any[], lang: Language) {
  return restaurants.map(restaurant => ({
    ...restaurant,
    name: getLocalizedField(restaurant, 'name', lang),
    description: getLocalizedField(restaurant, 'description', lang),
    menuItems: translateMenuItems(restaurant.menuItems || [], lang),
  }));
}
