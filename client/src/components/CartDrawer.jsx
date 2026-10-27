import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ImageFallback } from './ImageFallback';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingCharge,
    total,
    totalItems,
    amountNeededForFreeShipping,
    freeShippingProgress
  } = useCart();

  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-cocoa/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-drawer flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-cream flex items-center justify-between bg-ivory/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cocoa" />
              <h2 className="font-serif text-2xl font-normal text-cocoa">
                Your Ritual Bag
              </h2>
              <span className="text-xs bg-blush px-2 py-0.5 rounded-full font-medium text-cocoa">
                {totalItems}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-cream text-cocoa/70 hover:text-cocoa transition-colors"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-blush-light px-6 py-3 border-b border-blush/60">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-cocoa">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-dark" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-800">Complimentary Shipping Unlocked</span>
                ) : (
                  <span>
                    Add <strong className="text-cocoa">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> for Complimentary Shipping
                  </span>
                )}
              </span>
              <span className="text-[11px] text-taupe">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-cream/70 flex items-center justify-center mb-4 text-taupe">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl text-cocoa mb-2">
                  Your ritual bag is empty
                </h3>
                <p className="text-sm text-taupe max-w-xs mb-6 font-light">
                  Thoughtfully designed daily essentials await to elevate your skincare routine.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="btn-primary rounded-xl"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product._id}
                  className="flex gap-4 p-3 rounded-xl border border-cream/80 hover:border-blush transition-colors bg-ivory/20"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/products/${item.product.slug || item.product._id}`}
                    onClick={closeCart}
                    className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-cream/40"
                  >
                    <ImageFallback
                      src={item.product.images?.[0]}
                      alt={item.product.name}
                      category={item.product.category}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/products/${item.product.slug || item.product._id}`}
                          onClick={closeCart}
                          className="font-serif text-base text-cocoa hover:text-rose-dark line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-taupe hover:text-rose transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-taupe mt-0.5">{item.product.volume || item.product.category}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-cream rounded-lg bg-white overflow-hidden shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="p-1.5 hover:bg-cream/50 text-cocoa transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-medium text-cocoa select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="p-1.5 hover:bg-cream/50 text-cocoa transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-sans font-medium text-sm text-cocoa">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-cream bg-ivory/30 space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-taupe">
                  <span>Subtotal</span>
                  <span className="text-cocoa font-medium">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-taupe">
                  <span>Estimated Delivery</span>
                  <span className="text-cocoa font-medium">
                    {shippingCharge === 0 ? (
                      <span className="text-emerald-700 font-semibold">Free</span>
                    ) : (
                      `₹${shippingCharge.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-cocoa pt-2 border-t border-cream">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full btn-primary rounded-xl py-4 flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/cart"
                onClick={closeCart}
                className="w-full btn-outline rounded-xl py-2.5 flex items-center justify-center text-xs text-cocoa hover:bg-cream/40 transition-colors"
              >
                <span>View Full Bag & Apply Promo</span>
              </Link>

              <button
                onClick={closeCart}
                className="w-full text-center text-xs text-taupe hover:text-cocoa py-1 transition-colors uppercase tracking-widest font-light"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
