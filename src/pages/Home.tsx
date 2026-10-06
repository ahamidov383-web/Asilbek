import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Users, Building2, Star, ArrowRight, Shield, Utensils, Globe2, DollarSign } from 'lucide-react';
import { places } from '../data/mock';

export default function Home() {
  const { t } = useLanguage();

  const stats = [
    { icon: <MapPin className="text-blue-500" size={24} />, value: '150+', label: t('home.stats.tours') },
    { icon: <Building2 className="text-teal-500" size={24} />, value: '45', label: t('home.stats.agencies') },
    { icon: <Star className="text-amber-500" size={24} />, value: '500+', label: t('home.stats.places') },
    { icon: <Users className="text-purple-500" size={24} />, value: '10K+', label: t('home.stats.tourists') },
  ];

  const features = [
    { icon: <Globe2 size={32} className="text-blue-500" />, title: t('home.features.culture'), desc: t('home.features.cultureDesc') },
    { icon: <Utensils size={32} className="text-orange-500" />, title: t('home.features.food'), desc: t('home.features.foodDesc') },
    { icon: <Shield size={32} className="text-green-500" />, title: t('home.features.safety'), desc: t('home.features.safetyDesc') },
    { icon: <DollarSign size={32} className="text-emerald-500" />, title: t('home.features.value'), desc: t('home.features.valueDesc') },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🕌</div>
          <div className="absolute top-20 right-20 text-6xl">🏛️</div>
          <div className="absolute bottom-20 left-1/4 text-7xl">🐫</div>
          <div className="absolute bottom-10 right-1/3 text-5xl">🍽️</div>
          <div className="absolute top-1/2 right-10 text-6xl">🏰</div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t('home.hero')}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              {t('home.heroSub')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 bg-white text-blue-800 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
              >
                {t('home.exploreTours')}
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/agencies"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                {t('home.findAgencies')}
              </Link>
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,60 1440,50 L1440,100 L0,100 Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all">
                <div className="flex justify-center mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t('home.popularTitle')}
            </h2>
            <p className="text-gray-500 text-lg">{t('home.popularSub')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {places.slice(0, 3).map((place) => (
              <Link
                key={place.id}
                to="/places"
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-blue-100 to-teal-50 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                  {place.image}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      {place.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {place.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{place.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/places"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
            >
              View all places <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t('home.whyTitle')}
            </h2>
            <p className="text-gray-500 text-lg">{t('home.whySub')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all">
                <div className="flex justify-center mb-4 w-16 h-16 mx-auto rounded-2xl bg-gray-50 items-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to explore Uzbekistan?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Submit your travel request and let verified agencies create the perfect trip for you.
          </p>
          <Link
            to="/request"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg"
          >
            {t('nav.request')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
