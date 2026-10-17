import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { restaurants } from '../data/mock';
import { termizRestaurants } from '../data/termiz';
import { Restaurant } from '../types';
import {
  ArrowLeft, Star, MapPin, Clock, DollarSign, Phone, Mail,
  Heart, Share2, ExternalLink, ChefHat, Utensils, Camera
} from 'lucide-react';
import Map from '../components/Map';
import ImageGallery from '../components/ImageGallery';
import { cn } from '../lib/utils';

// Restoran rasmlari
const restaurantImages: Record<string, string[]> = {
  'naqsh': [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
  ],
  'zulayxo': [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
  ],
  'al-qasr': [
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
  ],
  'shahzod': [
    'https://images.unsplash.com/photo-1619740455993-9d701c81e1e4?w=800',
    'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=800',
  ],
};

// Menyu kategoriyalari
const menuCategories = [
  { id: 'all', label: 'Barchasi', icon: <Utensils size={16} /> },
  { id: 'hot', label: 'Issiq taomlar', icon: <ChefHat size={16} /> },
  { id: 'soup', label: 'Sho\'rva', icon: <ChefHat size={16} /> },
  { id: 'drinks', label: 'Ichimliklar', icon: <ChefHat size={16} /> },
];

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundRestaurant = [...restaurants, ...termizRestaurants].find(r => r.id === id);
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
        setError(null);
      } else {
        setError('Restoran topilmadi');
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Restoran topilmadi'}</h2>
          <p className="text-gray-600 mb-6">Siz qidirayotgan restoran mavjud emas</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Restoranlarga qaytish
          </button>
        </div>
      </div>
    );
  }

  const images = restaurantImages[restaurant.id] || [restaurant.image || ''];

  // Menyu filtrlash
  const filteredMenuItems = selectedCategory === 'all'
    ? restaurant.menuItems
    : restaurant.menuItems.filter(item => {
        // Oddiy kategoriyalash (haqiqiy loyihada database dan keladi)
        if (selectedCategory === 'hot') {
          return item.name.toLowerCase().includes('osh') || 
                 item.name.toLowerCase().includes('lag\'mon') ||
                 item.name.toLowerCase().includes('shashlik');
        }
        if (selectedCategory === 'soup') {
          return item.name.toLowerCase().includes('sho\'rva') || 
                 item.name.toLowerCase().includes('mastava');
        }
        if (selectedCategory === 'drinks') {
          return item.name.toLowerCase().includes('choy') || 
                 item.name.toLowerCase().includes('ayron');
        }
        return true;
      });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/restaurants')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Orqaga</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <ImageGallery images={images} title={restaurant.name} />

            {/* Title & Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {restaurant.rating && (
                      <div className="flex items-center gap-1">
                        <Star size={18} className="text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-gray-900">{restaurant.rating}</span>
                      </div>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />
                    <span>{restaurant.address || 'Termiz, O\'zbekiston'}</span>
                  </div>
                </div>
              </div>

              {/* Cuisine Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {restaurant.cuisineType.map((cuisine, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                    isFavorite
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  )}
                >
                  <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                  {isFavorite ? 'Saqlangan' : 'Sayohat rejasiga qo\'shish'}
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <Share2 size={18} />
                  Ulashish
                </button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Working Hours */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Ish vaqti
                </h3>
                <p className="text-gray-600">Har kuni: 08:00 - 22:00</p>
              </div>

              {/* Average Price */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                  O'rtacha narx
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {restaurant.avgPrice.toLocaleString()} so'm
                </p>
                <p className="text-sm text-gray-500">bir kishi uchun</p>
              </div>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-orange-600" />
                Menyu
              </h2>

              {/* Category Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {menuCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
                      selectedCategory === category.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {category.icon}
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Menu Items */}
              <div className="space-y-3">
                {filteredMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-orange-600">
                        {item.price.toLocaleString()} so'm
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMenuItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ChefHat size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Bu kategoriyada taomlar yo'q</p>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-green-600" />
                Xaritada joylashuv
              </h2>
              <Map
                center={[restaurant.latitude, restaurant.longitude]}
                zoom={15}
                markers={[
                  {
                    id: restaurant.id,
                    position: [restaurant.latitude, restaurant.longitude],
                    title: restaurant.name,
                    type: 'restaurant',
                    description: restaurant.cuisineType.join(', '),
                  },
                ]}
                height="400px"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Bog'lanish</h3>
              <div className="space-y-3">
                <a
                  href="tel:+998762251234"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                    <Phone size={16} className="text-green-600" />
                  </div>
                  <span>+998 76 225 12 34</span>
                </a>
                <a
                  href="mailto:info@restaurant.uz"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Mail size={16} className="text-blue-600" />
                  </div>
                  <span>info@restaurant.uz</span>
                </a>
                {restaurant.address && (
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-amber-600" />
                    </div>
                    <span>{restaurant.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
              <h3 className="font-bold text-xl mb-4">Tezkor ma'lumot</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-orange-100">Oshxona turi</span>
                  <span className="font-semibold">{restaurant.cuisineType.length} ta</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-100">Taomlar soni</span>
                  <span className="font-semibold">{restaurant.menuItems.length} ta</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-100">Reyting</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Star size={14} className="text-amber-300 fill-amber-300" />
                    {restaurant.rating || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-4xl mb-3">🍽️</div>
              <h3 className="font-bold text-gray-900 mb-2">Buyurtma bermoqchimisiz?</h3>
              <p className="text-sm text-gray-500 mb-4">Restoran bilan bevosita bog'laning</p>
              <a
                href="tel:+998762251234"
                className="block w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <Phone size={16} className="inline mr-2" />
                Qo'ng'iroq qilish
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
