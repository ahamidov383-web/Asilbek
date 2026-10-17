import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { termizPlaces, termizRoutes, termizBusStops, termizRestaurants } from '../data/termiz';
import { Place } from '../types';
import {
  ArrowLeft, MapPin, Clock, DollarSign, Bus, Navigation, Calendar,
  Phone, Mail, Share2, Heart, MessageSquare, Star, ExternalLink,
  CheckCircle, Copy, Send
} from 'lucide-react';
import Map from '../components/Map';
import FindMyLocation, { findNearestBusStop, calculateDistance } from '../components/FindMyLocation';
import ImageGallery from '../components/ImageGallery';
import { cn } from '../lib/utils';
import { getPlaceTranslation } from '../lib/i18n';
import { useLanguage } from '../context/LanguageContext';

// Rasm galereyasi uchun rasmlar (har bir joy uchun)
const placeImages: Record<string, string[]> = {
  'fayoztepa': [
    'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
    'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
  ],
  'qoratepa': [
    'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  ],
  'termiz-museum': [
    'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
    'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800',
  ],
  'al-hakim-at-termiziy': [
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
    'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
  ],
  'sulton-saodat': [
    'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  ],
};

// Chipta narxlari (mahalliy va chet elliklar uchun)
const ticketPrices: Record<string, { local: number; foreign: number }> = {
  'fayoztepa': { local: 20000, foreign: 50000 },
  'qoratepa': { local: 15000, foreign: 40000 },
  'termiz-museum': { local: 25000, foreign: 60000 },
  'al-hakim-at-termiziy': { local: 0, foreign: 0 }, // Bepul
  'sulton-saodat': { local: 10000, foreign: 30000 },
};

export default function PlaceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestStop, setNearestStop] = useState<{ stop: any; distance: number } | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Tarjima olish
  const translation = place ? getPlaceTranslation(place, language) : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundPlace = termizPlaces.find(p => p.id === id);
      if (foundPlace) {
        setPlace(foundPlace);
        setError(null);
      } else {
        setError('Joy topilmadi');
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  // Yaqin atrofdagi restoranlarni topish (1km radius)
  const getNearbyRestaurants = () => {
    if (!place) return [];
    
    return termizRestaurants
      .map(rest => ({
        ...rest,
        distance: calculateDistance(
          place.latitude,
          place.longitude,
          rest.latitude,
          rest.longitude
        ),
      }))
      .filter(rest => rest.distance <= 1) // 1km radius
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  };

  // O'xshash joylarni topish
  const getRelatedPlaces = () => {
    if (!place) return [];
    
    return termizPlaces
      .filter(p => p.id !== place.id && (p.type === place.type || 
        calculateDistance(place.latitude, place.longitude, p.latitude, p.longitude) < 5))
      .slice(0, 4);
  };

  // Ulashish funksiyalari
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = place ? `${place.name} - ${place.description?.slice(0, 100)}...` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Joy topilmadi'}</h2>
          <p className="text-gray-600 mb-6">Siz qidirayotgan joy mavjud emas</p>
          <button
            onClick={() => navigate('/places')}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Joylarga qaytish
          </button>
        </div>
      </div>
    );
  }

  const images = placeImages[place.id] || [place.image || ''];
  const prices = ticketPrices[place.id] || { local: 20000, foreign: 50000 };
  const nearbyRestaurants = getNearbyRestaurants();
  const relatedPlaces = getRelatedPlaces();

  // Transport yo'nalishlari
  const nearbyRoutes = termizRoutes.filter(route =>
    route.stops.some(stop =>
      Math.abs(stop.latitude - place.latitude) < 0.01 &&
      Math.abs(stop.longitude - place.longitude) < 0.01
    )
  );

  // Xarita markerlari
  const mapMarkers = [
    {
      id: place.id,
      position: [place.latitude, place.longitude] as [number, number],
      title: translation?.name || place.name_uz,
      type: 'destination' as const,
      description: place.type,
    },
    ...termizBusStops
      .filter(stop => calculateDistance(place.latitude, place.longitude, stop.latitude, stop.longitude) < 0.5)
      .map(stop => ({
        id: stop.id,
        position: [stop.latitude, stop.longitude] as [number, number],
        title: stop.name,
        type: 'bus_stop' as const,
        description: 'Avtobus bekati',
      })),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/places')}
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
            <ImageGallery images={images} title={translation?.name || ''} />

            {/* Title & Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {place.type}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{place.name}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />
                    <span>Termiz, O'zbekiston</span>
                  </div>
                </div>
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

                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Share2 size={18} />
                    Ulashish
                  </button>

                  {showShareMenu && (
                    <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-10">
                      <button
                        onClick={copyToClipboard}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <Copy size={16} />
                        <span>{copied ? 'Nusxalandi!' : 'Havolani nusxalash'}</span>
                      </button>
                      <button
                        onClick={shareWhatsApp}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <Send size={16} className="text-green-600" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={shareTelegram}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <Send size={16} className="text-blue-600" />
                        <span>Telegram</span>
                      </button>
                    </div>
                  )}
                </div>

                <Link
                  to={`/places/${place.id}/reviews`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MessageSquare size={18} />
                  Sharh qoldirish
                </Link>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tavsif</h2>
              <p className="text-gray-600 leading-relaxed">{place.description}</p>
            </div>

            {/* Ticket Prices */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                Chipta narxlari
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-700 font-medium mb-1">Mahalliy aholi uchun</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {prices.local === 0 ? 'Bepul' : `${prices.local.toLocaleString()} so'm`}
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-sm text-purple-700 font-medium mb-1">Chet elliklar uchun</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {prices.foreign === 0 ? 'Bepul' : `${prices.foreign.toLocaleString()} so'm`}
                  </div>
                </div>
              </div>
            </div>

            {/* How to Get There */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Bus className="w-6 h-6 text-blue-600" />
                Qanday borish mumkin
              </h2>
              <p className="text-gray-600 mb-4">{place.howToGet}</p>

              {nearbyRoutes.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700">Yaqin atrofdagi transport:</h3>
                  {nearbyRoutes.map((route) => {
                    const nearestRouteStop = route.stops.reduce((nearest, stop) => {
                      const dist = calculateDistance(place.latitude, place.longitude, stop.latitude, stop.longitude);
                      return dist < nearest.distance ? { stop, distance: dist } : nearest;
                    }, { stop: route.stops[0], distance: Infinity });

                    const walkingMinutes = Math.round(nearestRouteStop.distance * 1000 / 80); // 80m/min

                    return (
                      <div key={route.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Bus className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{route.name}</div>
                            <div className="text-sm text-gray-600">
                              {nearestRouteStop.stop.stopName} → {Math.round(nearestRouteStop.distance * 1000)}m, {walkingMinutes} daqiqa
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{route.price.toLocaleString()} so'm</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Eslatma:</strong> Bu joyga jamoat transporti to'g'ridan-to'g'ri bormaydi. Taksi yoki shaxsiy transport tavsiya etiladi.
                  </p>
                </div>
              )}

              {/* Find My Location */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <FindMyLocation
                  onLocationFound={(location) => {
                    setUserLocation(location);
                    const nearest = findNearestBusStop(location[0], location[1], termizBusStops);
                    setNearestStop(nearest);
                  }}
                />

                {nearestStop && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">Eng yaqin avtobus bekati</h3>
                    </div>
                    <p className="text-green-800 font-medium">{nearestStop.stop.name}</p>
                    <p className="text-sm text-green-700">
                      Masofa: <strong>{(nearestStop.distance * 1000).toFixed(0)}m</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Navigation className="w-6 h-6 text-green-600" />
                Xaritada joylashuv
              </h2>
              <Map
                center={[place.latitude, place.longitude]}
                zoom={15}
                markers={mapMarkers}
                height="400px"
                showUserLocation={!!userLocation}
                userLocation={userLocation}
              />
            </div>

            {/* Nearby Restaurants */}
            {nearbyRestaurants.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Yaqin atrofdagi restoranlar</h2>
                  <Link
                    to="/restaurants"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    Barchasini ko'rish
                    <ExternalLink size={14} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {nearbyRestaurants.map((rest) => (
                    <Link
                      key={rest.id}
                      to={`/restaurants/${rest.id}`}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={rest.image}
                        alt={rest.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{rest.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{rest.cuisineType.join(', ')}</span>
                          <span>•</span>
                          <span>{(rest.distance * 1000).toFixed(0)}m</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star size={14} className="fill-current" />
                          <span className="text-sm font-medium text-gray-700">{rest.rating}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {rest.avgPrice.toLocaleString()} so'm
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Tezkor ma'lumot</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Ish vaqti</div>
                    <div className="text-sm text-gray-600">{place.workHours}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Kirish haqi</div>
                    <div className="text-sm text-gray-600">{place.ticketPrice}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Turi</div>
                    <div className="text-sm text-gray-600">{place.type}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Bog'lanish</h3>
              <div className="space-y-3">
                <a href="tel:+998762251234" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                    <Phone size={16} className="text-green-600" />
                  </div>
                  <span>+998 76 225 12 34</span>
                </a>
                <a href="mailto:info@termiztravel.uz" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Mail size={16} className="text-blue-600" />
                  </div>
                  <span>info@termiztravel.uz</span>
                </a>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl shadow-lg p-6 text-white">
              <h3 className="font-bold text-xl mb-2">Sayohat rejalashtiryapsizmi?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Professional gidlar bilan Termizni kashf eting
              </p>
              <Link
                to="/agencies"
                className="block w-full py-3 bg-white text-blue-700 rounded-lg font-semibold text-center hover:bg-blue-50 transition-colors"
              >
                Agentliklarni ko'rish
              </Link>
            </div>
          </div>
        </div>

        {/* Related Places */}
        {relatedPlaces.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">O'xshash joylar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedPlaces.map((related) => (
                <Link
                  key={related.id}
                  to={`/places/${related.id}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img
                    src={related.image}
                    alt={related.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{related.name}</h3>
                    <p className="text-sm text-gray-600">{related.type}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
