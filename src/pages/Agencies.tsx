import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { agencies, tours } from '../data/mock';
import { Search, BadgeCheck, Star, MapPin } from 'lucide-react';

export default function Agencies() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [filterVerified, setFilterVerified] = useState(false);

  const filtered = agencies.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchVerified = !filterVerified || a.isVerified;
    return matchSearch && matchVerified;
  });

  const getTourCount = (agencyId: string) => tours.filter(t => t.agencyId === agencyId).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('agencies.title')}</h1>
          <p className="text-blue-100 text-lg">{t('agencies.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('agencies.search')}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <button
            onClick={() => setFilterVerified(!filterVerified)}
            className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
              filterVerified
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BadgeCheck size={18} />
            {t('agencies.verified')}
          </button>
        </div>

        {/* Agency Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((agency) => (
            <Link
              key={agency.id}
              to={`/agencies/${agency.id}`}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 block"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center text-3xl">
                  {agency.logo}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{agency.name}</h3>
                    {agency.isVerified && (
                      <BadgeCheck size={16} className="text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-gray-700">{agency.rating}</span>
                    <span className="text-sm text-gray-400">({agency.reviewCount} {t('agencies.reviews')})</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{agency.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {getTourCount(agency.id)} {t('agencies.tours')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    {agency.rating}
                  </span>
                </div>
                <span className="text-blue-600 text-sm font-medium flex items-center gap-1">
                  Batafsil →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No agencies found</p>
          </div>
        )}
      </div>
    </div>
  );
}
