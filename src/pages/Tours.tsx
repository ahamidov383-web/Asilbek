import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { tours } from '../data/mock';
import { Search, Calendar, Users, BadgeCheck, MapPin, Filter } from 'lucide-react';

export default function Tours() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = tours.filter((tour) => {
    const matchSearch = tour.title.toLowerCase().includes(search.toLowerCase()) ||
      tour.description.toLowerCase().includes(search.toLowerCase());
    const matchPrice = tour.price <= maxPrice;
    return matchSearch && matchPrice;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('tours.title')}</h1>
          <p className="text-teal-100 text-lg">{t('tours.subtitle')}</p>
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
              placeholder={t('tours.search')}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
              showFilters ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter size={18} />
            {t('tours.filter')}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('tours.priceRange')}</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700 min-w-[80px]">
                    ${maxPrice} {t('common.perPerson')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tour) => {
            const isFull = tour.availableSeats === 0;
            const seatsPercentage = (tour.availableSeats / tour.totalSeats) * 100;

            return (
              <div
                key={tour.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 ${
                  isFull ? 'opacity-75' : ''
                }`}
              >
                {/* Tour Image */}
                <div className="h-48 bg-gradient-to-br from-blue-100 via-teal-50 to-emerald-100 flex items-center justify-center text-6xl relative">
                  {tour.image}
                  {isFull && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
                        {t('tours.full')}
                      </span>
                    </div>
                  )}
                  {tour.agencyVerified && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium text-blue-700">
                      <BadgeCheck size={12} />
                      Verified
                    </div>
                  )}
                </div>

                {/* Tour Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{tour.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{tour.description}</p>

                  {/* Dates */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar size={14} />
                    <span>{formatDate(tour.startDate)} - {formatDate(tour.endDate)}</span>
                  </div>

                  {/* Agency */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <MapPin size={14} />
                    <span>{tour.agencyName}</span>
                  </div>

                  {/* Seats */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="flex items-center gap-1 text-gray-600">
                        <Users size={14} />
                        {tour.availableSeats} {t('tours.seats')}
                      </span>
                      <span className="text-gray-400">{tour.totalSeats} total</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isFull ? 'bg-red-400' :
                          seatsPercentage < 30 ? 'bg-amber-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${seatsPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${tour.price}</span>
                      <span className="text-sm text-gray-400 ml-1">{t('common.perPerson')}</span>
                    </div>
                    <button
                      disabled={isFull}
                      className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                        isFull
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isFull ? t('tours.full') : t('tours.book')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No tours found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
