import React from 'react';
import TourCardSkeleton from './TourCardSkeleton';
import Skeleton from './Skeleton';
import { cn } from '../../lib/utils';

interface PageSkeletonProps {
  className?: string;
  cardCount?: number;
  showHeader?: boolean;
  title?: string;
}

/**
 * Full-page skeleton loader
 * Shows header placeholder and grid of TourCardSkeletons
 */
export default function PageSkeleton({
  className,
  cardCount = 6,
  showHeader = true,
  title,
}: PageSkeletonProps) {
  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {/* Header section */}
      {showHeader && (
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {title ? (
              <Skeleton variant="text" className="w-1/2 h-10 bg-white/20 mb-3" />
            ) : (
              <>
                <Skeleton variant="text" className="w-3/4 h-10 bg-white/20 mb-3" />
                <Skeleton variant="text" className="w-1/2 h-6 bg-white/20" />
              </>
            )}
          </div>
        </div>
      )}

      {/* Content section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters placeholder */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Skeleton variant="rounded" className="flex-1 h-12" />
          <Skeleton variant="rounded" className="w-full sm:w-32 h-12" />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: cardCount }).map((_, index) => (
            <TourCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
