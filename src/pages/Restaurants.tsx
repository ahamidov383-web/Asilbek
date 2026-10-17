import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { restaurants } from '../data/mock';
import { termizRestaurants } from '../data/termiz';
import { Restaurant } from '../types';
import {
  Search, Star, MapPin, Filter, X, ChefHat, DollarSign,
  SlidersHorizontal, ArrowUpDown, Utensils
} from 'lucide-react';
import { cn } from '../lib/utils';

// Oshxona turlari
const cuisineTypes = [
  { id: 'osh', label: 'Osh', icon: '🍚' },
  { id: 'somsa', label: 'Somsa', icon: '🥟' },
  { id: 'shashlik', label: 'Shashlik', icon: '🍢' },
  { id: 'lag\'mon', label: 'Lag\'mon', icon: '🍜' },
  { id: 'manti', label: 'Manti', icon: '🥟' },
  { id: 'kabob', label: 'Kabob', icon: '🍖' },
  { id: 'choyxona', label: 'Choyxona', icon: '🫖' },
  { id: 'fast food', label: 'Fast Food', icon: '🍔' },
];

// Narx diapazonlari
const priceRanges = [
  { id: 'cheap', label: 'Arzon', range: '<20,000', min: 0, max: 20000 },
  { id: 'medium', label: 'O\'rtacha', range: '20,000-40,000', min: 20000, max: 40000 },
  { id: 'expensive', label: 'Qimmat', range: '>40,000', min: 40000, max: Infinity },
];

// Reyting filtrlari
const ratingFilters = [
  { value: 0, label: 'Barchasi' },
  { value: 3, label: '3+ yulduz' },
  { value: 4, label: '4+ yulduz' },
  { value: 4.5, label: '4.5+ yulduz' },
];

// Saralash variantlari
const sortOptions = [
  { value: 'rating', label: 'Reyting bo\'yicha' },
  { value: 'price-asc', label: 'Narx (arzon)' },
  { value: 'price-desc', label: 'Narx (qimmat)' },
  { value: 'name', label: 'Nomi bo\'yicha' },
];

export default function Restaurants() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // URL dan filtrlarni o'qish
  const searchQuery = searchParams.get('q') || '';
  const selectedCuisines = searchParams.get('cuisines')?.split(',').filter(Boolean) || [];
  const selectedPriceRange = searchParams.get('price') || '';
  const minRating = Number(searchParams.get('rating') || 0);
  const sortBy = searchParams.get('sort') || 'rating';

  // Barcha restoranlarni birlashtirish
  const allRestaurants = [...restaurants, ...termizRestaurants];

  // Filtrlash
  const filteredRestaurants = useMemo(() => {
    let result = [...allRestaurants];

    // Qidiruv
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.cuisineType.some(c => c.toLowerCase().includes(query)) ||
        r.menuItems.some(m => m.name.toLowerCase().includes(query))
      );
    }

    // Oshxona turi
    if (selectedCuisines.length > 0) {
      result = result.filter(r =>
        selectedCuisines.some(cuisine =>
          r.cuisineType.some(type => type.toLowerCase().includes(cuisine.toLowerCase()))
        )
      );
    }

    // Narx diapazoni
    if (selectedPriceRange) {
      const range = priceRanges.find(p => p.id === selectedPriceRange);
      if (range) {
        result = result.filter(r => r.avgPrice >= range.min && r.avgPrice < range.max);
      }
    }

    // Reyting
    if (minRating > 0) {
      result = result.filter(r => (r.rating || 0) >= minRating);
    }

    // Saralash
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price-asc':
        result.sort((a, b) => a.avgPrice - b.avgPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.avgPrice - a.avgPrice);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [allRestaurants, searchQuery, selectedCuisines, selectedPriceRange, minRating, sortBy]);

  // Filterni yangilash
  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  // Oshxona turini qo'shish/olib tashlash
  const toggleCuisine = (cuisine: string) => {
    const current = selectedCuisines;
    const updated = current.includes(cuisine)
      ? current.filter(c => c !== cuisine)
      : [...current, cuisine];
    updateFilter('cuisines', updated.join(','));
  };

  // Barcha filtrlarni tozalash
  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Restoranlar va taomlar</h1>
          <p className="text-red-100 text-lg">O'zbekistonning mazali taomlarini kashf eting</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="sticky top-16 z-30 bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          {/* Search Input */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => updateFilter('q', e.target.value)}
                placeholder="Restoran yoki taom qidirish..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => updateFilter('q', '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors',
                showFilters
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <SlidersHorizontal size={20} />
              <span className="hidden sm:inline">Filtrlar</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {/* Cuisine Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Utensils size={16} className="inline mr-1" />
                  Oshxona turi
                </label>
                <div className="flex flex-wrap gap-2">
                  {cuisineTypes.map((cuisine) => (
                    <button
                      key={cuisine.id}
                      onClick={() => toggleCuisine(cuisine.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                        selectedCuisines.includes(cuisine.id)
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      <span className="mr-1">{cuisine.icon}</span>
                      {cuisine.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-1" />
                  Narx diapazoni
                </label>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => updateFilter('price', selectedPriceRange === range.id ? '' : range.id)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        selectedPriceRange === range.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {range.label}
                      <span className="ml-1 text-xs opacity-75">({range.range})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Star size={16} className="inline mr-1" />
                  Minimal reyting
                </label>
                <div className="flex flex-wrap gap-2">
                  {ratingFilters.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => updateFilter('rating', filter.value === 0 ? '' : String(filter.value))}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        minRating === filter.value
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <ArrowUpDown size={16} className="inline mr-1" />
                  Saralash
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedCuisines.length > 0 || selectedPriceRange || minRating > 0) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={16} />
                  Filtrlarni tozalash
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredRestaurants.length}</span> ta restoran topildi
          </p>
        </div>

        {/* Restaurants Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Hech narsa topilmadi</h3>
            <p className="text-gray-600 mb-6">Filtrlarni o'zgartirib ko'ring</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((rest) => (
              <RestaurantCard key={rest.id} restaurant={rest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Restaurant Card Component
function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {restaurant.rating && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-gray-900">{restaurant.rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
          {restaurant.name}
        </h3>

        {/* Cuisine Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {restaurant.cuisineType.slice(0, 3).map((cuisine, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs font-medium rounded-full"
            >
              {cuisine}
            </span>
          ))}
        </div>

        {/* Price and Rating */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-500">O'rtacha narx</div>
            <div className="text-lg font-bold text-gray-900">
              {restaurant.avgPrice.toLocaleString()} so'm
            </div>
          </div>
          <div className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium group-hover:bg-orange-600 transition-colors">
            Batafsil
          </div>
        </div>
      </div>
    </Link>
  );
}
