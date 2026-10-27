import React from 'react';

export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-cream p-3 flex flex-col">
      <div className="aspect-[4/5] rounded-xl animate-shimmer mb-4 w-full" />
      <div className="h-3 w-1/4 rounded animate-shimmer mb-2" />
      <div className="h-5 w-3/4 rounded animate-shimmer mb-2" />
      <div className="h-3 w-full rounded animate-shimmer mb-4" />
      <div className="h-4 w-1/3 rounded animate-shimmer mt-auto" />
    </div>
  );
};
