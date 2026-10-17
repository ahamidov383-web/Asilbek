import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';

// Tarjima fayllarini import qilish
import messagesUz from '../messages/uz.json';
import messagesRu from '../messages/ru.json';
import messagesEn from '../messages/en.json';

const messages: Record<Language, any> = {
  uz: messagesUz,
  ru: messagesRu,
  en: messagesEn,
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
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'uz';
  });

  // Til o'zgarganda localStorage'ga saqlash
  useEffect(() => {
    localStorage.setItem('language', language);
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
