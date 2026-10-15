import React, { useEffect, useState } from 'react';

interface MapMarker {
  id: string;
  position: [number, number];
  title: string;
  description?: string;
  image?: string;
  onClick?: () => void;
}

interface MapProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  height?: string;
  className?: string;
}

export default function Map({ center, zoom = 13, markers = [], height = '400px', className = '' }: MapProps) {
  const [MapComponent, setMapComponent] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Dynamic import - faqat client-side da yuklanadi
  useEffect(() => {
    setIsMounted(true);

    // react-leaflet ni dynamic import qilish
    import('react-leaflet').then((module) => {
      setMapComponent(() => module);
    }).catch(err => {
      console.error('react-leaflet import failed:', err);
    });
  }, []);

  // Leaflet icon fix
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        // Fix default marker icons
        delete (L.default.Icon.Default.prototype as any)._getIconUrl;
        L.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
      });
    }
  }, []);

  if (!isMounted || !MapComponent) {
    return (
      <div 
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Xarita yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponent;

  return (
    <div className={`rounded-lg overflow-hidden shadow-md ${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            eventHandlers={{
              click: marker.onClick,
            }}
          >
            <Popup>
              <div className="p-2">
                {marker.image && (
                  <img
                    src={marker.image}
                    alt={marker.title}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <h3 className="font-bold text-sm mb-1">{marker.title}</h3>
                {marker.description && (
                  <p className="text-xs text-gray-600">{marker.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
