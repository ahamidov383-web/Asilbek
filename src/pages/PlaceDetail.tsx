import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { termizPlaces, termizRoutes } from '../data/termiz';
import { Place } from '../types';
import { ArrowLeft, MapPin, Clock, DollarSign, Bus, Navigation, Calendar } from 'lucide-react';
import Map from '../components/Map';

export default function PlaceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
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

  // Find transport routes that pass near this place
  const nearbyRoutes = termizRoutes.filter(route => 
    route.stops.some(stop => 
      Math.abs(stop.latitude - place.latitude) < 0.01 && 
      Math.abs(stop.longitude - place.longitude) < 0.01
    )
  );

  const mapMarkers = [
    {
      id: place.id,
      position: [place.latitude, place.longitude] as [number, number],
      title: place.name,
      description: place.type,
      image: place.image,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate('/places')}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg hover:bg-white transition-colors shadow-lg"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Orqaga</span>
          </button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                {place.type}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{place.name}</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                Termiz, O'zbekiston
              </span>
              <span className="flex items-center gap-1">
                <DollarSign size={16} />
                {place.ticketPrice}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tavsif</h2>
              <p className="text-gray-600 leading-relaxed">{place.description}</p>
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
                  {nearbyRoutes.map((route) => (
                    <div key={route.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Bus className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{route.name}</div>
                          <div className="text-sm text-gray-600">{route.from} → {route.to}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{route.price.toLocaleString()} so'm</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Eslatma:</strong> Bu joyga jamoat transporti to'g'ridan-to'g'ri bormaydi. Taksi yoki shaxsiy transport tavsiya etiladi.
                  </p>
                </div>
              )}
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
              />
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Koordinatalar:</strong> {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}</p>
              </div>
            </div>
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
      </div>
    </div>
  );
}
