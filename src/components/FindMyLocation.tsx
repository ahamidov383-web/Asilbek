import React, { useState } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface FindMyLocationProps {
  onLocationFound: (location: [number, number]) => void;
  className?: string;
}

/**
 * Haversine formula - ikki nuqta orasidagi masofani hisoblash (km)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Yer radiusi (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Eng yaqin avtobus bekatini topish
 */
export function findNearestBusStop(
  userLat: number,
  userLon: number,
  busStops: { id: string; name: string; latitude: number; longitude: number }[]
): { stop: typeof busStops[0]; distance: number } | null {
  if (busStops.length === 0) return null;

  let nearest = busStops[0];
  let minDistance = calculateDistance(userLat, userLon, nearest.latitude, nearest.longitude);

  for (const stop of busStops) {
    const distance = calculateDistance(userLat, userLon, stop.latitude, stop.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = stop;
    }
  }

  return { stop: nearest, distance: minDistance };
}

/**
 * "Mening joylashuvim" tugmasi
 * Browser geolocation API dan foydalanadi
 */
export default function FindMyLocation({ onLocationFound, className }: FindMyLocationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = () => {
    setLoading(true);
    setError(null);

    // Browser geolocation qo'llab-quvvatlashini tekshirish
    if (!navigator.geolocation) {
      setError('Brauzeringiz geolokatsiyani qo\'llab-quvvatlamaydi');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      // Muvaffaqiyat
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationFound([latitude, longitude]);
        setLoading(false);
      },
      // Xato
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Joylashuvga ruxsat berilmadi. Iltimos, sozlamalardan ruxsat bering.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Joylashuv ma\'lumoti mavjud emas.');
            break;
          case err.TIMEOUT:
            setError('Joylashuv so\'rovi vaqti tugadi.');
            break;
          default:
            setError('Noma\'lum xato yuz berdi.');
            break;
        }
      },
      // Options
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <button
        onClick={handleGetLocation}
        disabled={loading}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
          'bg-primary hover:bg-primary-dark text-white',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Joylashuv aniqlanmoqda...</span>
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4" />
            <span>Mening joylashuvim</span>
          </>
        )}
      </button>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
