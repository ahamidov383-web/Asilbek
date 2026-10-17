import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslations } from '../context/LanguageContext';

/**
 * useTranslations hook misoli
 * next-intl'ga o'xshash API
 */
export default function TranslationsDemo() {
  const t = useTranslations('home');
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4">{t('hero.title')}</h2>
          <p className="text-xl mb-6">{t('hero.subtitle')}</p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              to="/places"
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              {t('explorePlaces')}
            </Link>
            <Link
              to="/restaurants"
              className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              {t('findRestaurants')}
            </Link>
            <Link
              to="/tours"
              className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              {t('browseTours')}
            </Link>
          </div>
        </section>

        {/* Footer Demo */}
        <footer className="bg-gray-900 text-white rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">{t('about')}</h3>
              <p className="text-gray-400 text-sm">
                O'zbekiston bo'ylab sayohat platformasi
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Havolalar</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/places" className="text-gray-400 hover:text-white transition-colors">
                    Joylar
                  </Link>
                </li>
                <li>
                  <Link to="/restaurants" className="text-gray-400 hover:text-white transition-colors">
                    Restoranlar
                  </Link>
                </li>
                <li>
                  <Link to="/agencies" className="text-gray-400 hover:text-white transition-colors">
                    Agentliklar
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Huquqiy</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-400">{t('privacy')}</li>
                <li className="text-gray-400">{t('terms')}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            {t('copyright')}
          </div>
        </footer>

        {/* Code Example */}
        <section className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Kod misoli</h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// useTranslations hook ishlatish
import { useTranslations } from '../context/LanguageContext';

export default function Component() {
  const t = useTranslations('home');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('explorePlaces')}</button>
      <button>{t('findRestaurants')}</button>
      <button>{t('browseTours')}</button>
    </div>
  );
}`}
          </pre>
        </section>
      </div>
    </div>
  );
}
