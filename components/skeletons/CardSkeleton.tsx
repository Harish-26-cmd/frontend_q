import React from 'react';
import { Skeleton } from './Skeleton';

interface CardSkeletonProps {
  withImage?: boolean;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ withImage = true }) => {
  return (
    <div className="bg-card rounded-xl shadow-md p-4 flex flex-col gap-4">
      {withImage && <Skeleton className="w-full h-40" />}
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-10 w-full mt-auto" />
    </div>
  );
};