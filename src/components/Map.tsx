import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Marker turlari
export type MarkerType = 'destination' | 'bus_stop' | 'user_location' | 'restaurant';

export interface MapMarker {
  id: string;
  position: [number, number];
  title: string;
  type: MarkerType;
  description?: string;
  link?: string;
  onClick?: () => void;
}

export interface MapPolyline {
  id: string;
  positions: [number, number][];
  color?: string;
  weight?: number;
  label?: string;
}

interface MapProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  polylines?: MapPolyline[];
  height?: string;
  className?: string;
  showUserLocation?: boolean;
  userLocation?: [number, number] | null;
}

// Marker ranglari
const markerColors: Record<MarkerType, string> = {
  destination: '#ef4444',
  bus_stop: '#3b82f6',
  user_location: '#10b981',
  restaurant: '#f59e0b',
};

// Marker ikonkalari
const markerIcons: Record<MarkerType, string> = {
  destination: '📍',
  bus_stop: '🚏',
  user_location: '📍',
  restaurant: '🍽️',
};

// Leaflet icon fix
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

export default function Map({
  center,
  zoom = 13,
  markers = [],
  polylines = [],
  height = '400px',
  className = '',
  showUserLocation = false,
  userLocation = null,
}: MapProps) {
  // Custom icon yaratish
  const createCustomIcon = (type: MarkerType) => {
    if (typeof window === 'undefined') return null;
    
    const color = markerColors[type];
    const icon = markerIcons[type];

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 16px;">${icon}</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  // User location icon
  const createUserLocationIcon = () => {
    if (typeof window === 'undefined') return null;
    
    return L.divIcon({
      className: 'user-location-marker',
      html: `
        <div style="
          background-color: ${markerColors.user_location};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.3);
          animation: pulse 2s infinite;
        "></div>
        <style>
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
          }
        </style>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  // Marker tipini o'zbek tiliga tarjima qilish
  const getMarkerTypeLabel = (type: MarkerType): string => {
    const labels: Record<MarkerType, string> = {
      destination: 'Diqqatga sazovor joy',
      bus_stop: 'Avtobus bekati',
      user_location: 'Sizning joylashuvingiz',
      restaurant: 'Restoran',
    };
    return labels[type];
  };

  return (
    <div className={`rounded-lg overflow-hidden shadow-md ${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> hissadorlari'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Markers */}
        {markers.map((marker) => {
          const icon = createCustomIcon(marker.type);
          if (!icon) return null;
          
          return (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={icon}
              eventHandlers={{
                click: marker.onClick,
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-base mb-1">{marker.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {getMarkerTypeLabel(marker.type)}
                  </p>
                  {marker.description && (
                    <p className="text-sm text-gray-700 mb-3">{marker.description}</p>
                  )}
                  {marker.link && (
                    <a
                      href={marker.link}
                      className="inline-block px-3 py-1.5 bg-primary text-white text-sm rounded hover:bg-primary-dark transition-colors"
                    >
                      Batafsil →
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* User Location */}
        {showUserLocation && userLocation && (() => {
          const icon = createUserLocationIcon();
          if (!icon) return null;
          
          return (
            <Marker position={userLocation} icon={icon}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-base mb-1">Sizning joylashuvingiz</h3>
                  <p className="text-sm text-gray-600">
                    {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })()}

        {/* Polylines (Routes) */}
        {polylines.map((polyline) => (
          <Polyline
            key={polyline.id}
            positions={polyline.positions}
            pathOptions={{
              color: polyline.color || '#3b82f6',
              weight: polyline.weight || 4,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
