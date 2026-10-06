import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { places } from '../data/mock';
import { Search, MapPin, Clock, DollarSign, Bus, Filter } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function Places() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const types = ['All', ...Array.from(new Set(places.map(p => p.type)))];

  const filtered = places.filter((place) => {
    const matchSearch = place.name.toLowerCase().includes(search.toLowerCase()) ||
      place.description.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || place.type === typeFilter;
    return matchSearch && matchType;
  });

  const selected = places.find(p => p.id === selectedPlace);

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
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-3xl flex-shrink-0">
                    {place.image}
                  </div>
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
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="lg:sticky lg:top-24 h-[500px] lg:h-[calc(100vh-200px)] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <MapContainer
              center={[39.6542, 66.9758]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filtered.map((place) => (
                <Marker
                  key={place.id}
                  position={[place.latitude, place.longitude]}
                  icon={defaultIcon}
                  eventHandlers={{
                    click: () => setSelectedPlace(place.id),
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{place.name}</strong>
                      <br />
                      {place.type}
                      <br />
                      {place.ticketPrice}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
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
