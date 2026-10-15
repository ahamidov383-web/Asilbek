import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { restaurants } from '../data/mock';
import { termizRestaurants, priceIndicators } from '../data/termiz';
import { Search, Star, DollarSign, Utensils, MapPin, ChefHat, TrendingUp } from 'lucide-react';

export default function Restaurants() {
  const { t } = useLanguage();
  const [foodSearch, setFoodSearch] = useState('');
  const [restSearch, setRestSearch] = useState('');
  const [selectedRest, setSelectedRest] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState<'all' | 'termiz' | 'other'>('all');
  const [showPriceGuide, setShowPriceGuide] = useState(false);

  // Barcha restoranlarni birlashtirish
  const allRestaurants = [...restaurants, ...termizRestaurants];

  const filtered = allRestaurants.filter((rest) => {
    const matchFood = !foodSearch ||
      rest.cuisineType.some(c => c.toLowerCase().includes(foodSearch.toLowerCase())) ||
      rest.menuItems.some(m => m.name.toLowerCase().includes(foodSearch.toLowerCase()));
    const matchRest = !restSearch ||
      rest.name.toLowerCase().includes(restSearch.toLowerCase());
    const matchCity = cityFilter === 'all' || 
      (cityFilter === 'termiz' && termizRestaurants.some(r => r.id === rest.id)) ||
      (cityFilter === 'other' && !termizRestaurants.some(r => r.id === rest.id));
    return matchFood && matchRest && matchCity;
  });

  const selected = allRestaurants.find(r => r.id === selectedRest);

  const popularFoods = ['plov', 'osh', 'shashlik', 'lagman', 'lag\'mon', 'somsa', 'somsa', 'kabob', 'tea', 'choy', 'bread', 'non', 'noodles', 'grill', 'go\'sht'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('restaurants.title')}</h1>
          <p className="text-red-100 text-lg">{t('restaurants.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* City Filter */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setCityFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              cityFilter === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Barcha shaharlar
          </button>
          <button
            onClick={() => setCityFilter('termiz')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              cityFilter === 'termiz'
                ? 'bg-orange-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            🏛️ Termiz
          </button>
          <button
            onClick={() => setCityFilter('other')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              cityFilter === 'other'
                ? 'bg-orange-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Boshqa shaharlar
          </button>
        </div>

        {/* Price Guide */}
        <div className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-orange-600" />
              Narx ko'rsatkichlari
            </h3>
            <button
              onClick={() => setShowPriceGuide(!showPriceGuide)}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              {showPriceGuide ? 'Yashirish' : 'Ko\'rsatish'}
            </button>
          </div>
          {showPriceGuide && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-xl p-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">💰 Byudjet</div>
                <div className="text-lg font-bold text-green-600">
                  {priceIndicators.food.budget.min.toLocaleString()} - {priceIndicators.food.budget.max.toLocaleString()} so'm
                </div>
                <div className="text-xs text-gray-500 mt-1">{priceIndicators.food.budget.description}</div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">💵 O'rtacha</div>
                <div className="text-lg font-bold text-blue-600">
                  {priceIndicators.food.mid_range.min.toLocaleString()} - {priceIndicators.food.mid_range.max.toLocaleString()} so'm
                </div>
                <div className="text-xs text-gray-500 mt-1">{priceIndicators.food.mid_range.description}</div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">💎 Qimmat</div>
                <div className="text-lg font-bold text-purple-600">
                  {priceIndicators.food.expensive.min.toLocaleString()} - {priceIndicators.food.expensive.max.toLocaleString()} so'm
                </div>
                <div className="text-xs text-gray-500 mt-1">{priceIndicators.food.expensive.description}</div>
              </div>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-3">
            💱 Valyuta: {priceIndicators.currency} | {priceIndicators.exchange_rate}
          </div>
        </div>

        {/* Food Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <ChefHat size={20} className="text-orange-500" />
            {t('restaurants.searchFood')}
          </h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              placeholder={t('restaurants.searchFood')}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {popularFoods.map((food) => (
              <button
                key={food}
                onClick={() => setFoodSearch(foodSearch === food ? '' : food)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  foodSearch === food
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                }`}
              >
                {food}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={restSearch}
            onChange={(e) => setRestSearch(e.target.value)}
            placeholder={t('restaurants.searchRest')}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
          />
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rest) => (
            <div
              key={rest.id}
              onClick={() => setSelectedRest(selectedRest === rest.id ? null : rest.id)}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all duration-300 border-2 ${
                selectedRest === rest.id
                  ? 'border-orange-400 shadow-md'
                  : 'border-transparent hover:border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="h-36 relative overflow-hidden">
                {rest.image && rest.image.startsWith('http') ? (
                  <img
                    src={rest.image}
                    alt={rest.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center text-5xl">
                    {rest.image || '🍽️'}
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium text-gray-700">{rest.rating}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1">{rest.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin size={12} />
                  <span className="line-clamp-1">{rest.address}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {rest.cuisineType.map((cuisine) => (
                    <span
                      key={cuisine}
                      className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs font-medium rounded-full"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    {t('restaurants.avgPrice')}: <strong className="text-gray-900">${rest.avgPrice}</strong> {t('restaurants.perPerson')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Menu Detail */}
        {selected && (
          <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-5xl">{selected.image}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selected.name}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin size={14} />
                  {selected.address}
                </p>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Utensils size={18} className="text-orange-500" />
              {t('restaurants.menu')}
            </h3>
            <div className="space-y-3">
              {selected.menuItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <span className="text-lg font-bold text-orange-600">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No restaurants found</p>
          </div>
        )}
      </div>
    </div>
  );
}
