import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { ImageFallback } from './ImageFallback';

export const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      setSearchTerm('');
      setResults([]);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.getProducts({ search: searchTerm.trim(), limit: 6 });
        setResults(data.products || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isOpen) return null;

  const handleSelectProduct = (slugOrId) => {
    onClose();
    navigate(`/products/${slugOrId}`);
  };

  const handleCategoryClick = (category) => {
    onClose();
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-cocoa/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative min-h-screen px-4 flex items-start justify-center pt-20 sm:pt-28 pb-12">
        <div className="relative bg-white rounded-3xl shadow-float max-w-2xl w-full p-6 sm:p-8 overflow-hidden border border-cream">
          {/* Header & Input */}
          <div className="relative flex items-center border-b border-cream pb-4">
            <Search className="w-5 h-5 text-taupe mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search rituals, serums, lip treatments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-base sm:text-lg text-cocoa placeholder:text-taupe/60 bg-transparent outline-none font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 rounded-full text-taupe hover:text-cocoa mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-taupe hover:text-cocoa rounded-full hover:bg-cream/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Categories */}
          <div className="pt-4 pb-2">
            <span className="text-[11px] uppercase tracking-luxury text-taupe block mb-2 font-medium">
              Popular Rituals
            </span>
            <div className="flex flex-wrap gap-2">
              {['Cleansers', 'Serums', 'Moisturizers', 'Lip Care'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="px-3.5 py-1.5 rounded-full text-xs bg-ivory hover:bg-blush text-cocoa border border-cream hover:border-blush-dark transition-all duration-200"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Area */}
          <div className="mt-4 max-h-96 overflow-y-auto pr-1">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-taupe gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-rose" />
                <span className="text-xs">Finding essentials...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleSelectProduct(product.slug || product._id)}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-cream hover:border-rose/40 hover:bg-ivory/50 transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-16 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                      <ImageFallback
                        src={product.images?.[0]}
                        alt={product.name}
                        category={product.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-rose-dark block">
                        {product.category}
                      </span>
                      <h4 className="font-serif text-sm text-cocoa font-medium truncate group-hover:text-rose-dark transition-colors">
                        {product.name}
                      </h4>
                      <span className="text-xs text-cocoa font-medium">
                        ₹{product.price?.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-taupe opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            ) : searchTerm.trim() ? (
              <div className="py-10 text-center text-taupe">
                <p className="text-sm">No rituals found matching "{searchTerm}"</p>
                <p className="text-xs text-taupe/70 mt-1">Try searching for Serums, Cloud Cream, or Lip Care</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
