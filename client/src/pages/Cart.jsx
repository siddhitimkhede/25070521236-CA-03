import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Heart,
  Truck,
  ShieldCheck,
  Sparkles,
  Tag,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ImageFallback } from '../components/ImageFallback';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, shippingCharge, total } = useCart();
  const { addToWishlist } = useWishlist();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Demo coupon code state
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percent
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const FREE_SHIPPING_THRESHOLD = 1500;
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const code = couponCode.trim().toUpperCase();
    if (code === 'ROSSELE10') {
      setAppliedDiscount(10);
      setCouponSuccess('10% Luxury Welcome discount applied!');
      addToast('Promo code applied: 10% discount');
    } else if (code === 'GLOW20') {
      setAppliedDiscount(20);
      setCouponSuccess('20% Editorial Glow discount applied!');
      addToast('Promo code applied: 20% discount');
    } else {
      setCouponError('Invalid promo code. Try "ROSSELE10" or "GLOW20"');
    }
  };

  const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
  const finalCalculatedTotal = Math.max(0, total - discountAmount);

  const handleMoveToWishlist = (product) => {
    addToWishlist(product);
    removeFromCart(product._id);
    addToast(`Saved "${product.name}" to your wishlist`);
  };

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-24 max-w-xl mx-auto px-4 text-center">
        <div className="bg-white rounded-3xl p-10 sm:p-14 border border-cream shadow-xs">
          <div className="w-20 h-20 rounded-full bg-blush/50 flex items-center justify-center mx-auto text-rose-dark mb-6 border border-blush">
            <ShoppingBag className="w-9 h-9 stroke-[1.5]" />
          </div>
          <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block mb-2">
            Shopping Bag
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-cocoa mb-3">
            Your Bag is Empty
          </h1>
          <p className="text-xs sm:text-sm text-taupe font-light mb-8 max-w-sm mx-auto leading-relaxed">
            Your daily skincare routine awaits. Discover gentle cleansers, dewy serums, and comforting barrier moisturizers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/shop"
              className="btn-primary rounded-xl text-xs w-full sm:w-auto inline-flex items-center justify-center gap-2"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/wishlist"
              className="btn-outline rounded-xl text-xs w-full sm:w-auto inline-flex items-center justify-center gap-2"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>View Saved Wishlist</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block mb-1">
          Review Your Routine
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-cocoa">
          Shopping Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Bag Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Complimentary Shipping Progress Banner */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-cream shadow-xs">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-cocoa flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-rose-dark" />
                {amountNeeded === 0
                  ? '✨ You unlocked Complimentary Express Delivery!'
                  : `Add ₹${amountNeeded.toLocaleString('en-IN')} more for Complimentary Delivery`}
              </span>
              <span className="text-taupe font-light">{progressPercent}%</span>
            </div>
            <div className="w-full bg-cream rounded-full h-2 overflow-hidden">
              <div
                className="bg-cocoa h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream shadow-xs divide-y divide-cream">
            {cart.map((item) => (
              <div key={item.product._id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                {/* Item Details */}
                <div className="flex items-center gap-4 flex-1">
                  <Link
                    to={`/products/${item.product.slug || item.product._id}`}
                    className="w-20 h-24 rounded-2xl overflow-hidden bg-ivory flex-shrink-0 border border-cream"
                  >
                    <ImageFallback
                      src={item.product.images && item.product.images[0]}
                      alt={item.product.name}
                      category={item.product.category}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-rose-dark font-medium">
                      {item.product.category}
                    </span>
                    <Link
                      to={`/products/${item.product.slug || item.product._id}`}
                      className="font-serif text-base sm:text-lg text-cocoa hover:text-rose-dark transition-colors block line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-taupe font-light">{item.product.volume}</p>
                    <p className="text-xs font-sans font-medium text-cocoa sm:hidden pt-1">
                      ₹{item.product.price?.toLocaleString('en-IN')} each
                    </p>
                  </div>
                </div>

                {/* Unit Price (Desktop) */}
                <div className="hidden sm:block text-right px-4">
                  <span className="text-xs text-taupe block">Unit Price</span>
                  <span className="text-sm font-sans font-medium text-cocoa">
                    ₹{item.product.price?.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-cream rounded-xl bg-ivory/50 p-1">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-cocoa hover:text-rose-dark transition-colors rounded-lg hover:bg-white"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center text-xs font-semibold text-cocoa">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stockQuantity}
                    className="w-7 h-7 flex items-center justify-center text-cocoa hover:text-rose-dark transition-colors rounded-lg hover:bg-white disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Total Item Price & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                  <span className="font-sans font-semibold text-base text-cocoa">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMoveToWishlist(item.product)}
                      title="Save to Wishlist"
                      className="p-1.5 text-taupe hover:text-rose-dark transition-colors rounded-lg hover:bg-cream/40"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      title="Remove item"
                      className="p-1.5 text-taupe hover:text-rose-dark transition-colors rounded-lg hover:bg-cream/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link
              to="/shop"
              className="text-xs uppercase tracking-luxury font-medium text-cocoa hover:text-rose-dark transition-colors"
            >
              ← Continue Shopping
            </Link>

            <button
              onClick={clearCart}
              className="text-xs text-taupe hover:text-rose-dark transition-colors"
            >
              Clear Entire Bag
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream shadow-xs space-y-6">
            <h2 className="font-serif text-xl text-cocoa font-normal pb-4 border-b border-cream">
              Order Summary
            </h2>

            {/* Price lines */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-taupe">
                <span>Subtotal ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                <span className="font-medium text-cocoa font-sans">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-taupe">
                <span>Estimated Shipping</span>
                <span className="font-medium text-cocoa font-sans">
                  {shippingCharge === 0 ? (
                    <span className="text-emerald-700 font-semibold uppercase tracking-wider text-[11px]">
                      Complimentary
                    </span>
                  ) : (
                    `₹${shippingCharge}`
                  )}
                </span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promo Discount ({appliedDiscount}%)</span>
                  <span className="font-medium font-sans">
                    -₹{discountAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="pt-4 border-t border-cream flex justify-between items-baseline">
                <span className="font-serif text-base text-cocoa font-normal">Estimated Total</span>
                <div className="text-right">
                  <span className="font-sans text-2xl font-semibold text-cocoa">
                    ₹{finalCalculatedTotal.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[10px] text-taupe font-light">
                    Includes all applicable taxes
                  </span>
                </div>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="pt-2">
              <label htmlFor="promo" className="text-xs text-taupe block mb-1 font-medium">
                Promotional Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-taupe absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="promo"
                    type="text"
                    placeholder="e.g. ROSSELE10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-cream text-xs uppercase bg-ivory/50 focus:border-rose outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cocoa text-ivory rounded-xl text-xs uppercase tracking-wider font-medium hover:bg-cocoa-light transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponSuccess && (
                <p className="text-[11px] text-emerald-700 mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {couponSuccess}
                </p>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600 mt-1.5">{couponError}</p>
              )}
            </form>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-primary rounded-xl text-xs py-3.5 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Guarantee */}
            <div className="pt-2 border-t border-cream/70 flex items-center justify-center gap-2 text-[11px] text-taupe font-light">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-dark" />
              <span>Complimentary Returns • Genuine 3-Tier MongoDB Sync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
