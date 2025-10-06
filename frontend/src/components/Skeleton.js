import React from 'react';

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 ${className}`} />;
}

export function ReportCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-40 rounded" />
      </div>
      <Skeleton className="h-4 w-full rounded mb-2" />
      <Skeleton className="h-4 w-3/4 rounded mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-4 w-48 rounded" />
        <Skeleton className="h-4 w-40 rounded" />
        <Skeleton className="h-4 w-40 rounded" />
      </div>
      <Skeleton className="h-2 w-full rounded mt-4" />
    </div>
  );
}








