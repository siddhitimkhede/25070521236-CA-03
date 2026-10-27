import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles, X, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/ProductSkeleton';

const CATEGORIES = [
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

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('newest');

  // Fetch products whenever filters or sort change
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          category: currentCategory === 'All' ? undefined : currentCategory,
          search: searchTerm.trim() || undefined,
          sort: sortBy
        };

        const res = await api.getProducts(params);
        setProducts(res.products || []);
      } catch (err) {
        console.error('Failed to load shop products:', err);
        setError(err.message || 'Unable to retrieve skincare catalogue.');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [currentCategory, searchTerm, sortBy]);

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block mb-2">
          The Complete Collection
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-normal text-cocoa mb-3">
          Shop The Rituals
        </h1>
        <p className="text-sm text-taupe font-light leading-relaxed">
          Sensory formulas developed to hydrate, comfort, and nourish your daily skin routine.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-cream shadow-xs mb-10 space-y-4">
        {/* Category Pills */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-cream pb-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-xl text-xs uppercase tracking-luxury font-medium transition-all ${
                  currentCategory === cat
                    ? 'bg-cocoa text-ivory shadow-xs'
                    : 'bg-ivory text-cocoa/80 hover:bg-blush border border-cream hover:border-blush-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-taupe font-light">
            Showing {products.length} {products.length === 1 ? 'essential' : 'essentials'}
          </span>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-taupe absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search formulations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe hover:text-cocoa"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-taupe" />
            <label htmlFor="sort" className="text-xs text-taupe whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none cursor-pointer"
            >
              <option value="newest">Featured & Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A to Z</option>
              <option value="name-desc">Alphabetical: Z to A</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
        </div>
      ) : error ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-cream shadow-xs">
          <p className="text-sm text-rose-dark mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-outline rounded-xl">
            <RefreshCw className="w-3.5 h-3.5 mr-2" />
            Reload Catalogue
          </button>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-cream shadow-xs max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center mx-auto mb-3 text-taupe">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl text-cocoa mb-1">No products match your search</h3>
          <p className="text-xs text-taupe mb-6 font-light">
            We couldn't find any formulations matching your active criteria.
          </p>
          <button onClick={clearFilters} className="btn-primary rounded-xl">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
