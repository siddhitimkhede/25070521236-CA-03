import React, { useState } from 'react';

export const ImageFallback = ({ src, alt, className = '', category = 'Skincare' }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div className={`relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-cream to-blush-light p-6 text-center select-none ${className}`}>
        {/* Minimalist luxury cosmetic bottle graphic */}
        <div className="relative w-24 h-40 flex items-center justify-center mb-3 group">
          <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
            {/* Bottle cap */}
            <rect x="36" y="20" width="28" height="25" rx="3" fill="#D9AAA8" />
            <rect x="38" y="24" width="24" height="2" fill="#FAF7F2" opacity="0.6" />
            {/* Bottle neck */}
            <rect x="42" y="45" width="16" height="10" fill="#E2B8B6" />
            {/* Bottle body */}
            <rect x="20" y="55" width="60" height="125" rx="14" fill="#FAF7F2" stroke="#F3D9D8" strokeWidth="2" />
            {/* Gloss reflection highlight */}
            <path d="M28 65 Q 26 120 28 165" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" fill="none" />
            {/* Label */}
            <rect x="28" y="90" width="44" height="55" rx="4" fill="#F4EEE7" />
            <text x="50" y="112" fontFamily="'Cormorant Garamond', serif" fontSize="9" fontWeight="600" fill="#493633" textAnchor="middle" letterSpacing="1">
              ROSSELE
            </text>
            <text x="50" y="124" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="5" fontWeight="500" fill="#A89589" textAnchor="middle" letterSpacing="0.5">
              RITUAL
            </text>
            <circle cx="50" cy="133" r="1.5" fill="#D9AAA8" />
          </svg>
        </div>
        <span className="text-[10px] uppercase tracking-luxury text-taupe font-medium">
          {category}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-cream/40 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 animate-shimmer" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};
