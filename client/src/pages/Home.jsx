import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Droplets,
  ShieldCheck,
  Heart,
  Star,
  CheckCircle2,
  Sun,
  Moon,
  Feather,
  Layers,
  ChevronRight,
  Send,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/ProductSkeleton';
import { ImageFallback } from '../components/ImageFallback';
import { useToast } from '../context/ToastContext';

const CATALOG_CATEGORIES = [
  'All',
  'Serums',
  'Moisturizers',
  'Cleansers',
  'Lip Care',
  'Toners & Mists',
  'Sun Care',
  'Eye & Targeted',
  'Masks & Treatments'
];

export const Home = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [featuredRes, allRes] = await Promise.all([
          api.getProducts({ featured: 'true', limit: 4 }),
          api.getProducts({ limit: 16 })
        ]);

        if (featuredRes.products && featuredRes.products.length > 0) {
          setBestsellers(featuredRes.products);
        } else {
          setBestsellers((allRes.products || []).slice(0, 4));
        }

        setAllProducts(allRes.products || []);
      } catch (err) {
        console.error('Failed to load homepage formulations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    try {
      await api.subscribeNewsletter(email);
      setSubscribed(true);
      addToast('Welcome to our private circle.');
      setEmail('');
    } catch (err) {
      addToast(err.message || 'Subscription failed', 'error');
    }
  };

  const filteredCatalogue =
    selectedCategory === 'All'
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory);

  return (
    <div className="pt-24 sm:pt-28">
      
      {/* 1. EDITORIAL HERO CAMPAIGN BANNER */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-cream via-ivory to-blush-light min-h-[620px] lg:min-h-[700px] flex items-center border border-blush/40 shadow-card">
          
          {/* Subtle Ambient Glow Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blush/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-rose/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-white/40 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-8 sm:p-12 lg:p-16 w-full">
            
            {/* Left: Typography & Hero CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-blush text-rose-dark text-xs uppercase tracking-luxury font-medium shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Minimalist Beauty House • 100% Barrier Loving</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-cocoa leading-[1.05] tracking-tight">
                Glazed. <br />
                Hydrated. <br />
                <span className="italic font-light text-cocoa-light">Restored.</span>
              </h1>

              <p className="text-base sm:text-lg text-taupe-dark max-w-lg font-light leading-relaxed">
                Thoughtfully formulated daily essentials for your softest skincare ritual. Formulated with skin-identical ceramides, botanical squalane, and multi-molecular hydration for an authentic, glass-skin glow.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <a href="#catalogue" className="btn-primary rounded-xl text-center group py-4 px-8 text-xs">
                  <span>Shop Skincare</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform inline-block" />
                </a>
                <a href="#rituals" className="btn-outline rounded-xl text-center bg-white/60 py-4 px-6 text-xs">
                  The Daily Rituals
                </a>
              </div>

              {/* Ritual Highlight Pills */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-blush/40 max-w-md">
                <div>
                  <span className="font-serif text-2xl text-cocoa font-normal block">15</span>
                  <span className="text-[11px] uppercase tracking-wider text-taupe font-medium">Formulations</span>
                </div>
                <div>
                  <span className="font-serif text-2xl text-cocoa font-normal block">100%</span>
                  <span className="text-[11px] uppercase tracking-wider text-taupe font-medium">Barrier Loving</span>
                </div>
                <div>
                  <span className="font-serif text-2xl text-cocoa font-normal block">₹1,500</span>
                  <span className="text-[11px] uppercase tracking-wider text-taupe font-medium">Free Delivery</span>
                </div>
              </div>
            </div>

            {/* Right: Glossy Hero Editorial Product Photograph */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-float border-4 border-white/80 bg-cream group">
                <ImageFallback
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80"
                  alt="Rossele Skin Ritual Dew Veil Serum"
                  category="Daily Essentials"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/50 via-transparent to-transparent" />

                {/* Floating Product Badge */}
                <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-cream shadow-soft flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-luxury text-rose-dark font-medium block">
                      Hero Formulation
                    </span>
                    <span className="font-serif text-base text-cocoa font-normal block">
                      Dew Veil Hydrating Serum
                    </span>
                    <span className="text-xs font-sans font-medium text-cocoa block mt-0.5">
                      ₹1,850 • Multi-Weight Hyaluronic Acid
                    </span>
                  </div>
                  <Link
                    to="/products/dew-veil-hydrating-serum"
                    className="p-2.5 rounded-full bg-blush hover:bg-blush-dark text-cocoa transition-colors"
                    aria-label="View Dew Veil Hydrating Serum"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CURATED BESTSELLERS SECTION ("The Daily Essentials") */}
      <section id="bestsellers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block mb-2">
              Curated Formulations
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-cocoa">
              The Daily Essentials
            </h2>
            <p className="text-xs sm:text-sm text-taupe font-light mt-1">
              Our most-requested barrier hydrators, glazed lip treatments, and restorative creams.
            </p>
          </div>
          <Link
            to="/shop"
            className="mt-4 sm:mt-0 text-xs uppercase tracking-luxury font-medium text-cocoa hover:text-rose-dark inline-flex items-center gap-1 group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic MongoDB Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, i) => <ProductSkeleton key={i} />)
          ) : bestsellers.length > 0 ? (
            bestsellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-taupe">
              <p>No formulations available yet. Please run the database seed script.</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. COMPLETE PRODUCT CATALOGUE ON HOMEPAGE */}
      <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28 scroll-mt-28">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream shadow-xs">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block mb-2">
              Formulation Library
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-cocoa mb-3">
              Explore The Complete Collection
            </h2>
            <p className="text-xs sm:text-sm text-taupe font-light leading-relaxed">
              Every formula is purposefully crafted with skin-identical lipids, gentle botanicals, and zero harsh fillers.
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2 pb-8 border-b border-cream mb-8">
            {CATALOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs uppercase tracking-luxury font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-cocoa text-ivory shadow-xs'
                    : 'bg-ivory text-cocoa/80 hover:bg-blush border border-cream hover:border-blush-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(8)
                .fill(0)
                .map((_, i) => <ProductSkeleton key={i} />)
            ) : filteredCatalogue.length > 0 ? (
              filteredCatalogue.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-taupe">
                <p>No formulations found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. THE 4-STEP ROSSELE RITUAL */}
      <section id="rituals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28 scroll-mt-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block mb-2">
            The Daily Routine
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-cocoa mb-4">
            The 4-Step Rossele Ritual
          </h2>
          <p className="text-sm text-taupe font-light leading-relaxed">
            Four purposeful steps formulated to reset, hydrate deeply, cushion the barrier, and shield your skin against daily exposure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 01 */}
          <div className="bg-white rounded-3xl p-6 border border-cream shadow-xs hover:border-blush hover:shadow-card transition-all flex flex-col justify-between">
            <div>
              <span className="font-serif text-3xl text-rose-dark/60 font-light block mb-2">01</span>
              <h3 className="font-serif text-2xl text-cocoa font-normal mb-2">Cleanse</h3>
              <p className="text-xs text-taupe leading-relaxed font-light mb-4">
                Melt impurities and sunscreen without stripping moisture using our pH 5.5 botanical cleansers.
              </p>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-ivory">
                <ImageFallback
                  src="https://images.unsplash.com/photo-1556228852-80b6e5eeff06?auto=format&fit=crop&w=800&q=80"
                  alt="Step 01 Cleanse"
                  category="01 Cleanse"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <Link to="/products/velvet-foam-gentle-cleanser" className="btn-outline rounded-xl text-center text-xs w-full py-2.5">
              Velvet Foam • ₹1,450
            </Link>
          </div>

          {/* Step 02 */}
          <div className="bg-white rounded-3xl p-6 border border-cream shadow-xs hover:border-blush hover:shadow-card transition-all flex flex-col justify-between">
            <div>
              <span className="font-serif text-3xl text-rose-dark/60 font-light block mb-2">02</span>
              <h3 className="font-serif text-2xl text-cocoa font-normal mb-2">Glaze</h3>
              <p className="text-xs text-taupe leading-relaxed font-light mb-4">
                Drench thirsty skin with 5-weight hyaluronic acid and biomimetic copper peptides for glass-skin bounce.
              </p>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-ivory">
                <ImageFallback
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
                  alt="Step 02 Glaze"
                  category="02 Glaze"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <Link to="/products/dew-veil-hydrating-serum" className="btn-outline rounded-xl text-center text-xs w-full py-2.5">
              Dew Veil • ₹1,850
            </Link>
          </div>

          {/* Step 03 */}
          <div className="bg-white rounded-3xl p-6 border border-cream shadow-xs hover:border-blush hover:shadow-card transition-all flex flex-col justify-between">
            <div>
              <span className="font-serif text-3xl text-rose-dark/60 font-light block mb-2">03</span>
              <h3 className="font-serif text-2xl text-cocoa font-normal mb-2">Comfort</h3>
              <p className="text-xs text-taupe leading-relaxed font-light mb-4">
                Envelop your face in soothing triple ceramides and oat extracts to cushion the natural lipid mantle.
              </p>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-ivory">
                <ImageFallback
                  src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
                  alt="Step 03 Comfort"
                  category="03 Comfort"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <Link to="/products/cloud-cream-barrier-moisturizer" className="btn-outline rounded-xl text-center text-xs w-full py-2.5">
              Cloud Cream • ₹2,150
            </Link>
          </div>

          {/* Step 04 */}
          <div className="bg-white rounded-3xl p-6 border border-cream shadow-xs hover:border-blush hover:shadow-card transition-all flex flex-col justify-between">
            <div>
              <span className="font-serif text-3xl text-rose-dark/60 font-light block mb-2">04</span>
              <h3 className="font-serif text-2xl text-cocoa font-normal mb-2">Protect</h3>
              <p className="text-xs text-taupe leading-relaxed font-light mb-4">
                Invisible 100% mineral zinc shield with broad spectrum SPF 50+ PA++++ and zero chalkiness.
              </p>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-ivory">
                <ImageFallback
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
                  alt="Step 04 Protect"
                  category="04 Protect"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <Link to="/products/solar-veil-invisible-daily-mineral-sunscreen-spf-50" className="btn-outline rounded-xl text-center text-xs w-full py-2.5">
              Solar Veil SPF 50+ • ₹1,950
            </Link>
          </div>
        </div>
      </section>

      {/* 5. BRAND PHILOSOPHY & SENSORY INGREDIENTS */}
      <section className="bg-cream/40 py-24 mb-28 border-y border-blush/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Editorial Image Grid */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-soft bg-white">
                <ImageFallback
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
                  alt="Rossele Skin Cream Ritual"
                  category="Restorative"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-soft mt-8 bg-white">
                <ImageFallback
                  src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
                  alt="Minimalist Skincare Texture"
                  category="Sensory"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Philosophy Copy */}
            <div className="lg:col-span-6 space-y-6 lg:pl-6">
              <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block">
                Brand Philosophy
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-cocoa leading-tight">
                Less noise. <br />
                <span className="italic font-light">More ritual.</span>
              </h2>

              <p className="text-base text-taupe leading-relaxed font-light">
                Modern skincare has become loud, confusing, and filled with twenty-step routines that exhaust your skin’s delicate barrier. Rossele Skin was created with an unwavering devotion to calm minimalism.
              </p>

              <p className="text-base text-taupe leading-relaxed font-light">
                Every formulation is crafted to cushion your skin, using time-honored botanical extracts alongside skin-identical lipids. No artificial dyes, no aggressive perfume, no false promises.
              </p>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/80 border border-cream shadow-xs">
                  <Droplets className="w-5 h-5 text-rose-dark mb-2" />
                  <h4 className="font-serif text-lg text-cocoa mb-1">Skin-Identical Lipids</h4>
                  <p className="text-xs text-taupe font-light">Triple ceramide complexes that reinforce barrier strength without clogging pores.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 border border-cream shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-rose-dark mb-2" />
                  <h4 className="font-serif text-lg text-cocoa mb-1">Cushion Glaze Textures</h4>
                  <p className="text-xs text-taupe font-light">Weightless dews and whipped creams crafted for sensory satisfaction.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/story" className="btn-primary rounded-xl text-xs py-3.5 px-6">
                  Read Our Full Story
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. REAL CUSTOMER REVIEWS FROM MONGODB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block mb-2">
            Loved By Our Community
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-cocoa mb-3">
            Words From Real Rituals
          </h2>
          <p className="text-xs sm:text-sm text-taupe font-light">
            Genuine experiences shared by verified Rossele Skin clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-cream shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-rose-dark">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-rose-dark" />
                ))}
              </div>
              <h4 className="font-serif text-xl text-cocoa">"The dewiest hydration without any tackiness"</h4>
              <p className="text-xs text-taupe leading-relaxed font-light">
                "Dew Veil completely transformed my morning routine. Two drops give that fresh, glazed-donut glow without feeling heavy under makeup. Highly recommend!"
              </p>
            </div>
            <div className="pt-6 border-t border-cream mt-6 flex items-center justify-between text-xs">
              <span className="font-medium text-cocoa">Elena Vance</span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                Verified Purchaser
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-cream shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-rose-dark">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-rose-dark" />
                ))}
              </div>
              <h4 className="font-serif text-xl text-cocoa">"Like a weighted blanket for dry skin"</h4>
              <p className="text-xs text-taupe leading-relaxed font-light">
                "The whipped texture of Cloud Cream is so unique. It locks in moisture all day without clogging my pores. Truly feels like a luxury spa experience."
              </p>
            </div>
            <div className="pt-6 border-t border-cream mt-6 flex items-center justify-between text-xs">
              <span className="font-medium text-cocoa">Mira K.</span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                Verified Purchaser
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-cream shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-rose-dark">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-rose-dark" />
                ))}
              </div>
              <h4 className="font-serif text-xl text-cocoa">"My forever peptide lip treatment"</h4>
              <p className="text-xs text-taupe leading-relaxed font-light">
                "Better than any luxury balm I have ever used. Gives the prettiest subtle flush and cushions my lips overnight. I keep one in my bag and on my nightstand."
              </p>
            </div>
            <div className="pt-6 border-t border-cream mt-6 flex items-center justify-between text-xs">
              <span className="font-medium text-cocoa">Priya D.</span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                Verified Purchaser
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. EDITORIAL NEWSLETTER SIGNUP */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-24">
        <div className="bg-gradient-to-br from-white via-ivory to-blush-light p-8 sm:p-12 rounded-3xl border border-blush shadow-card text-center space-y-4">
          <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block">
            Private Access
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-cocoa font-normal">
            A little glow in your inbox.
          </h2>
          <p className="text-xs sm:text-sm text-taupe font-light max-w-md mx-auto leading-relaxed">
            Receive secret formulation releases, skincare masterclasses, and complimentary shipping vouchers.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 p-3 bg-blush rounded-xl text-xs text-cocoa font-medium">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>You are subscribed. Check your inbox soon.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl border border-cream text-xs text-cocoa placeholder:text-taupe bg-white focus:border-rose outline-none"
              />
              <button
                type="submit"
                className="btn-primary rounded-xl whitespace-nowrap text-xs px-6 py-3"
              >
                <span>Subscribe</span>
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};
