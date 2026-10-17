import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import Lightbox from './Lightbox';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  if (images.length === 0) {
    return (
      <div className="h-96 bg-gray-200 rounded-xl flex items-center justify-center">
        <Camera size={48} className="text-gray-400" />
      </div>
    );
  }

  return (
    <>
      {/* Main image */}
      <div className="relative group cursor-pointer" onClick={() => openLightbox(0)}>
        <img
          src={images[0]}
          alt={`${title} - Asosiy rasm`}
          className="w-full h-96 object-cover rounded-xl"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
            <Camera size={20} className="inline mr-2" />
            <span className="text-sm font-medium">Rasmlarni ko'rish</span>
          </div>
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            <Camera size={14} className="inline mr-1" />
            {images.length} ta rasm
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.slice(1).map((img, idx) => (
            <button
              key={idx}
              onClick={() => openLightbox(idx + 1)}
              className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
            >
              <img src={img} alt={`${title} - Rasm ${idx + 2}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        images={images}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </>
  );
}
