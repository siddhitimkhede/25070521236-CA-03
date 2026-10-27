import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Droplets, ArrowRight, ShieldCheck } from 'lucide-react';
import { ImageFallback } from '../components/ImageFallback';

export const OurStory = () => {
  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block">
          Behind The Brand
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-normal text-cocoa leading-tight">
          Thoughtfully Made. <br />
          <span className="italic font-light">Softly Felt.</span>
        </h1>
        <p className="text-sm text-taupe font-light leading-relaxed">
          The story of a minimalist beauty house dedicated to restoring calmness to your daily ritual.
        </p>
      </div>

      {/* Hero Visual Section */}
      <div className="relative rounded-3xl overflow-hidden aspect-[16/9] max-h-[500px] mb-20 shadow-card bg-cream">
        <ImageFallback
          src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80"
          alt="Rossele Skin Editorial Story Visual"
          category="Brand Ethos"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-cocoa/30" />
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <p className="font-serif text-2xl sm:text-4xl text-ivory max-w-lg leading-relaxed font-light italic">
            "We believe the most luxurious beauty ritual is the one that gives your skin peace."
          </p>
        </div>
      </div>

      {/* Origin Story Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block">
            Our Inspiration
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-cocoa font-normal leading-tight">
            An antidote to complicated skincare.
          </h2>
          <p className="text-sm text-taupe leading-relaxed font-light">
            ROSSELE SKIN began with a clear realization: our bathrooms had become crowded with complicated routines, aggressive peeling agents, and products that compromised the skin's natural moisture barrier.
          </p>
          <p className="text-sm text-taupe leading-relaxed font-light">
            We stripped away the unnecessary noise. Instead of thirty ingredients in a bottle, we focused on biocompatible lipids, multi-depth hydration complexes, and botanical extracts that work harmoniously with your skin.
          </p>
          <div className="p-4 rounded-2xl bg-blush-light border border-blush text-xs text-cocoa font-light leading-relaxed">
            Every formula is tested for texture, glide, absorption, and finish. We design our packaging with soft ivory and blush curves that look like sculpture on your vanity.
          </div>
        </div>

        <div className="lg:col-span-6 aspect-[4/5] rounded-3xl overflow-hidden shadow-soft bg-cream">
          <ImageFallback
            src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80"
            alt="Sculptural Skincare Texture"
            category="Formulation"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Design Values */}
      <section id="values" className="bg-white rounded-3xl p-8 sm:p-14 border border-cream shadow-xs mb-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block mb-1">
            Our Standard
          </span>
          <h3 className="font-serif text-3xl text-cocoa font-normal">
            The Rossele Design Values
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 p-6 rounded-2xl bg-ivory/50 border border-cream">
            <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center text-cocoa">
              <Droplets className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl text-cocoa">Barrier-Centric Hydration</h4>
            <p className="text-xs text-taupe leading-relaxed font-light">
              We prioritize ceramides, humectants, and squalane that support the moisture envelope your skin already knows how to make.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-ivory/50 border border-cream">
            <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center text-cocoa">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl text-cocoa">Glazed Sensory Textures</h4>
            <p className="text-xs text-taupe leading-relaxed font-light">
              Skincare should feel delicious. From whipped cloud barrier creams to petal melt balms, each touch is designed for emotional delight.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-ivory/50 border border-cream">
            <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center text-cocoa">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl text-cocoa">Intentional Transparency</h4>
            <p className="text-xs text-taupe leading-relaxed font-light">
              Zero synthetic fragrances, parabens, or aggressive fillers. We publish our full ingredient decks clearly for every formulation.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="bg-blush-light rounded-3xl p-10 sm:p-16 text-center border border-blush shadow-soft max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block">
          Begin Your Journey
        </span>
        <h3 className="font-serif text-3xl sm:text-4xl text-cocoa font-normal">
          Experience your softest ritual today.
        </h3>
        <p className="text-xs sm:text-sm text-taupe font-light max-w-md mx-auto leading-relaxed">
          Explore our four everyday formulations designed to streamline your routine.
        </p>
        <div className="pt-2">
          <Link to="/shop" className="btn-primary rounded-xl">
            Shop The Collection
          </Link>
        </div>
      </div>
    </div>
  );
};
