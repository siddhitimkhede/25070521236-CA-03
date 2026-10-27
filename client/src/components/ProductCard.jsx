import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ImageFallback } from './ImageFallback';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;
  const productId = product._id || product.id;
  const isWishlisted = isInWishlist(productId);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-cream hover:border-rose/30 transition-all duration-500 hover:shadow-card">
      {/* Product Image Link */}
      <div className="relative aspect-[4/5] overflow-hidden bg-ivory block">
        <Link to={`/products/${product.slug || product._id}`} className="block w-full h-full">
          <ImageFallback
            src={product.images && product.images[0]}
            alt={product.name}
            category={product.category}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isFeatured && (
            <span className="bg-blush/90 backdrop-blur-sm text-cocoa text-[10px] uppercase tracking-luxury font-semibold px-2.5 py-1 rounded-full border border-blush-dark/30 shadow-xs">
              Essential
            </span>
          )}
          {isLowStock && (
            <span className="bg-rose-100/90 text-rose-800 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full">
              Only {product.stockQuantity} left
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-cocoa/90 text-ivory text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full">
              Sold out
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 shadow-xs ${
            isWishlisted
              ? 'bg-white text-rose-dark shadow-sm'
              : 'bg-white/80 backdrop-blur-xs text-taupe hover:text-rose-dark hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? 'fill-rose-dark scale-110' : ''}`} />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 hidden sm:block">
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`w-full py-3 px-4 rounded-xl text-xs uppercase tracking-luxury font-medium transition-all shadow-md flex items-center justify-center gap-2 ${
              isOutOfStock
                ? 'bg-cream text-taupe cursor-not-allowed'
                : 'bg-white/95 backdrop-blur-md text-cocoa hover:bg-cocoa hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {isOutOfStock ? 'Sold Out' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-xs text-taupe mb-1">
            <span className="uppercase tracking-widest text-[10px] font-medium text-rose-dark">
              {product.category}
            </span>
            {product.volume && (
              <span className="text-[11px] font-light">{product.volume}</span>
            )}
          </div>

          <Link to={`/products/${product.slug || product._id}`} className="block group-hover:text-rose-dark transition-colors">
            <h3 className="font-serif text-lg sm:text-xl font-normal text-cocoa leading-snug line-clamp-1 mb-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-taupe line-clamp-2 leading-relaxed mb-3 font-light">
            {product.tagline || product.shortDescription}
          </p>
        </div>

        <div className="pt-2 border-t border-cream/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-sans font-medium text-cocoa text-base">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-taupe line-through">
                ₹{product.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Mobile / Tablet Quick Add Button */}
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            aria-label={`Add ${product.name} to ritual bag`}
            className={`sm:hidden p-2.5 rounded-full border transition-colors ${
              isOutOfStock
                ? 'border-cream text-taupe cursor-not-allowed'
                : 'border-cream bg-ivory text-cocoa active:bg-blush'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
