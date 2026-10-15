import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { places } from '../data/mock';
import { termizPlaces, termizRoutes, termizBusStops } from '../data/termiz';
import { Search, MapPin, Clock, DollarSign, Bus, Navigation } from 'lucide-react';
import Map from '../components/Map';

export default function Places() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState<'all' | 'termiz' | 'other'>('all');
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [showRoutes, setShowRoutes] = useState(false);

  // Barcha joylarni birlashtirish
  const allPlaces = [...places, ...termizPlaces];
  const types = ['All', ...Array.from(new Set(allPlaces.map(p => p.type)))];

  const filtered = allPlaces.filter((place) => {
    const matchSearch = place.name.toLowerCase().includes(search.toLowerCase()) ||
      (place.description || '').toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || place.type === typeFilter;
    const matchCity = cityFilter === 'all' || 
      (cityFilter === 'termiz' && termizPlaces.some(p => p.id === place.id)) ||
      (cityFilter === 'other' && !termizPlaces.some(p => p.id === place.id));
    return matchSearch && matchType && matchCity;
  });

  const selected = allPlaces.find(p => p.id === selectedPlace);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('places.title')}</h1>
          <p className="text-amber-100 text-lg">{t('places.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* City Filter */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setCityFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              cityFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Barcha shaharlar
          </button>
          <button
            onClick={() => setCityFilter('termiz')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              cityFilter === 'termiz'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            🏛️ Termiz
          </button>
          <button
            onClick={() => setCityFilter('other')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              cityFilter === 'other'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Boshqa shaharlar
          </button>
        </div>

        {/* Search & Type Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('places.search')}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  typeFilter === type
                    ? 'bg-amber-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {type === 'All' ? t('places.allTypes') : type}
              </button>
            ))}
          </div>
        </div>

        {/* Transport Routes (Termiz) */}
        {cityFilter === 'termiz' && (
          <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Bus size={20} className="text-blue-600" />
                Termiz transport yo'nalishlari
              </h3>
              <button
                onClick={() => setShowRoutes(!showRoutes)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showRoutes ? 'Yashirish' : 'Ko\'rsatish'}
              </button>
            </div>
            {showRoutes && (
              <div className="space-y-4">
                {termizRoutes.map((route) => (
                  <div key={route.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Bus size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{route.name}</h4>
                          <p className="text-sm text-gray-500">{route.from} → {route.to}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{route.price.toLocaleString()} so'm</div>
                        <div className="text-xs text-gray-500">chipta narxi</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {route.stops.map((stop, index) => (
                        <React.Fragment key={stop.stopId}>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <span className="text-sm text-gray-700 whitespace-nowrap">{stop.stopName}</span>
                          </div>
                          {index < route.stops.length - 1 && (
                            <div className="w-8 h-0.5 bg-gray-300 flex-shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Places List */}
          <div className="space-y-4">
            {filtered.map((place) => (
              <div
                key={place.id}
                onClick={() => setSelectedPlace(place.id)}
                className={`bg-white rounded-2xl p-6 shadow-sm cursor-pointer transition-all duration-300 border-2 ${
                  selectedPlace === place.id
                    ? 'border-amber-400 shadow-md'
                    : 'border-transparent hover:border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  {place.image && place.image.startsWith('http') ? (
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-3xl flex-shrink-0">
                      {place.image || '📍'}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{place.name}</h3>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                        {place.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{place.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {place.workHours}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={12} />
                        {place.ticketPrice}
                      </span>
                    </div>
                    <Link
                      to={`/places/${place.id}`}
                      className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      Batafsil ko'rish →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="lg:sticky lg:top-24 h-[500px] lg:h-[calc(100vh-200px)] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <Map
              center={[41.11, 66.83]}
              zoom={13}
              height="100%"
              markers={filtered.map((place) => ({
                id: place.id,
                position: [place.latitude, place.longitude] as [number, number],
                title: place.name,
                description: `${place.type} - ${place.ticketPrice}`,
                image: place.image && place.image.startsWith('http') ? place.image : undefined,
                onClick: () => setSelectedPlace(place.id),
              }))}
            />
          </div>
        </div>

        {/* Selected Place Detail */}
        {selected && (
          <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-5xl">{selected.image}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selected.name}</h2>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                  {selected.type}
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">{selected.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Bus size={16} className="text-blue-500" />
                  {t('places.howToGet')}
                </div>
                <p className="text-sm text-gray-500">{selected.howToGet}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Clock size={16} className="text-green-500" />
                  {t('places.workHours')}
                </div>
                <p className="text-sm text-gray-500">{selected.workHours}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <DollarSign size={16} className="text-amber-500" />
                  {t('places.ticketPrice')}
                </div>
                <p className="text-sm text-gray-500">{selected.ticketPrice}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
