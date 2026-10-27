import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ImageFallback } from '../components/ImageFallback';

export const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, openCart } = useCart();
  const { addToast } = useToast();

  const handleMoveToCart = (product) => {
    if (product.stockQuantity <= 0) {
      addToast(`"${product.name}" is currently sold out`, 'error');
      return;
    }
    addToCart(product, 1);
    removeFromWishlist(product._id || product.id);
    addToast(`Moved "${product.name}" to your shopping bag`);
    openCart();
  };

  const handleMoveAllToCart = () => {
    let addedCount = 0;
    wishlist.forEach((product) => {
      if (product.stockQuantity > 0) {
        addToCart(product, 1);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      clearWishlist();
      addToast(`Moved ${addedCount} available item${addedCount > 1 ? 's' : ''} to your bag`);
      openCart();
    } else {
      addToast('No in-stock items available to move', 'error');
    }
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush/60 text-rose-dark text-xs uppercase tracking-luxury font-medium mb-3">
          <Heart className="w-3.5 h-3.5 fill-rose-dark" />
          <span>Curated Rituals</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-cocoa mb-3">
          Saved Formulations
        </h1>
        <p className="text-sm text-taupe font-light leading-relaxed">
          Your personal edit of barrier-loving essentials. Save items for later or effortlessly transfer them to your daily shopping bag.
        </p>
      </div>

      {wishlist.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-cream text-center max-w-xl mx-auto shadow-xs">
          <div className="w-20 h-20 rounded-full bg-blush/50 flex items-center justify-center mx-auto text-rose-dark mb-6 border border-blush">
            <Heart className="w-9 h-9 stroke-[1.5]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-cocoa mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs sm:text-sm text-taupe font-light mb-8 leading-relaxed max-w-md mx-auto">
            You haven't saved any formulations yet. Browse our daily essentials, cleansers, and nourishing lip treatments to curate your softest routine.
          </p>
          <Link
            to="/shop"
            className="btn-primary rounded-xl text-xs inline-flex items-center gap-2"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Wishlist Items */
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="bg-white rounded-2xl p-4 sm:px-6 border border-cream shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-luxury font-medium text-cocoa">
                {wishlist.length} Saved {wishlist.length === 1 ? 'Formulation' : 'Formulations'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={clearWishlist}
                className="text-xs text-taupe hover:text-rose-dark transition-colors font-medium px-3 py-1.5"
              >
                Clear All
              </button>
              <button
                onClick={handleMoveAllToCart}
                className="btn-primary rounded-xl text-xs flex items-center gap-2 py-2 px-4"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move All to Bag</span>
              </button>
            </div>
          </div>

          {/* Grid of Wishlist Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => {
              const isOutOfStock = product.stockQuantity <= 0;
              const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;
              const productId = product._id || product.id;

              return (
                <div
                  key={productId}
                  className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-cream hover:border-rose/30 transition-all duration-300 hover:shadow-card"
                >
                  {/* Image container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
                    <Link to={`/products/${product.slug || productId}`} className="block w-full h-full">
                      <ImageFallback
                        src={product.images && product.images[0]}
                        alt={product.name}
                        category={product.category}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </Link>

                    {/* Stock badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      {isOutOfStock ? (
                        <span className="bg-cocoa/90 text-ivory text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full">
                          Sold Out
                        </span>
                      ) : isLowStock ? (
                        <span className="bg-rose-100/90 text-rose-800 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full">
                          Only {product.stockQuantity} left
                        </span>
                      ) : (
                        <span className="bg-emerald-50/90 text-emerald-800 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full border border-emerald-200">
                          In Stock
                        </span>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromWishlist(productId)}
                      aria-label="Remove from wishlist"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-cream text-taupe hover:text-rose-dark hover:bg-white flex items-center justify-center transition-all shadow-xs z-10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Info & Actions */}
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

                      <Link
                        to={`/products/${product.slug || productId}`}
                        className="block group-hover:text-rose-dark transition-colors"
                      >
                        <h3 className="font-serif text-lg font-normal text-cocoa leading-snug line-clamp-1 mb-1">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-sans font-medium text-cocoa text-base">
                          ₹{product.price?.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-taupe line-through">
                            ₹{product.originalPrice?.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleMoveToCart(product)}
                      disabled={isOutOfStock}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs uppercase tracking-luxury font-medium transition-all flex items-center justify-center gap-2 ${
                        isOutOfStock
                          ? 'bg-cream text-taupe cursor-not-allowed'
                          : 'bg-cocoa text-ivory hover:bg-cocoa-light shadow-xs'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isOutOfStock ? 'Sold Out' : 'Move to Bag'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
