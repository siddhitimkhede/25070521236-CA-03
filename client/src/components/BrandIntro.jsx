import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const BrandIntro = ({ onComplete }) => {
  const [stage, setStage] = useState('initial'); // initial -> active -> fading -> done

  useEffect(() => {
    // 1. Fade in typography and ambient glow
    const enterTimer = setTimeout(() => {
      setStage('active');
    }, 100);

    // 2. Begin graceful fade out after 2.8 seconds
    const fadeTimer = setTimeout(() => {
      setStage('fading');
    }, 2800);

    // 3. Complete transition after fade animation finishes
    const completeTimer = setTimeout(() => {
      setStage('done');
      if (onComplete) onComplete();
    }, 3400);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setStage('fading');
    setTimeout(() => {
      setStage('done');
      if (onComplete) onComplete();
    }, 400);
  };

  if (stage === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-out ${
        stage === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 45%, #FFFFFF 0%, #FAF7F2 45%, #F4ECE7 80%, #ECDCD9 100%)'
      }}
    >
      {/* Delicate floating ambient blur halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-blush/40 rounded-full blur-3xl pointer-events-none animate-pulse duration-1000" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-rose/15 rounded-full blur-2xl pointer-events-none" />

      {/* Decorative hairline inner border */}
      <div className="absolute inset-4 sm:inset-8 border border-blush/40 rounded-3xl pointer-events-none" />

      {/* Main Centered Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto flex flex-col items-center select-none">
        {/* Subtle Brand Insignia */}
        <div
          className={`transition-all duration-1000 transform ${
            stage === 'active' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-blush/60 shadow-xs mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-dark animate-ping" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-taupe font-medium">
              The Daily Ritual Begins
            </span>
          </div>
        </div>

        {/* Brand Name in Elegant Cursive Script */}
        <div
          className={`transition-all duration-1000 delay-200 transform ${
            stage === 'active' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-98'
          }`}
        >
          <h1
            className="font-script text-6xl sm:text-8xl md:text-9xl text-cocoa font-normal leading-[1.05] tracking-tight drop-shadow-xs"
            style={{
              fontFamily: '"Pinyon Script", "Cormorant Garamond", cursive',
              textShadow: '0 2px 20px rgba(243, 217, 216, 0.5)'
            }}
          >
            Rossele Skin
          </h1>
        </div>

        {/* Tagline */}
        <div
          className={`transition-all duration-1000 delay-500 transform ${
            stage === 'active' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <p className="mt-4 font-serif text-lg sm:text-2xl text-cocoa-light font-light italic tracking-wider">
            Your skin, your ritual.
          </p>

          <div className="w-16 h-[1px] bg-rose-dark/40 mx-auto mt-4 mb-3" />

          <p className="text-[11px] uppercase tracking-[0.28em] text-taupe font-light">
            Minimalist Editorial Skincare
          </p>
        </div>

        {/* Subtle timer line */}
        <div className="w-32 sm:w-48 h-[2px] bg-cream rounded-full overflow-hidden mt-8">
          <div
            className="h-full bg-cocoa/60 rounded-full transition-all duration-[2700ms] ease-linear"
            style={{ width: stage === 'active' || stage === 'fading' ? '100%' : '0%' }}
          />
        </div>

        {/* Skip / Enter Ritual button */}
        <button
          onClick={handleSkip}
          className="mt-6 text-[11px] uppercase tracking-[0.2em] text-taupe hover:text-cocoa transition-colors flex items-center gap-1.5 font-medium py-1 px-3 rounded-full hover:bg-white/60"
        >
          <span>Enter Ritual</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
