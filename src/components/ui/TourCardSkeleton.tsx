import React from 'react';
import Skeleton from './Skeleton';
import { cn } from '../../lib/utils';

interface TourCardSkeletonProps {
  className?: string;
}

/**
 * Skeleton loader for tour cards
 * Shows image placeholder, text lines, and price placeholder
 */
export default function TourCardSkeleton({ className }: TourCardSkeletonProps) {
  return (
    <div className={cn('bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200', className)}>
      {/* Image placeholder */}
      <Skeleton variant="rectangular" className="w-full h-48" />

      <div className="p-4 sm:p-6">
        {/* Title */}
        <Skeleton variant="text" className="w-3/4 h-6 mb-3" />

        {/* Description lines */}
        <div className="space-y-2 mb-4">
          <Skeleton variant="text" className="w-full" />
          <Skeleton variant="text" className="w-5/6" />
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton variant="text" className="w-24 h-4" />
          <Skeleton variant="text" className="w-20 h-4" />
        </div>

        {/* Price and button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Skeleton variant="text" className="w-20 h-8" />
          <Skeleton variant="rounded" className="w-24 h-10" />
        </div>
      </div>
    </div>
  );
}
