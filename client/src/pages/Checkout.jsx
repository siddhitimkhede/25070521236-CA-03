import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { ImageFallback } from '../components/ImageFallback';

export const Checkout = () => {
  const { cart, subtotal, shippingCharge, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('demo_card'); // demo_card | demo_upi | cod
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Autofill user details if user is logged in or state updates
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  // If bag is empty, redirect to shop
  if (cart.length === 0) {
    return (
      <div className="pt-36 pb-24 text-center max-w-md mx-auto px-4">
        <h2 className="font-serif text-3xl text-cocoa mb-2">Your Bag is Empty</h2>
        <p className="text-xs text-taupe mb-6 font-light">
          Please add items to your ritual bag before proceeding to checkout.
        </p>
        <Link to="/shop" className="btn-primary rounded-xl">
          Explore The Collection
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.postalCode.trim()
    ) {
      setErrorMessage('Please complete all mandatory delivery fields.');
      addToast('Please complete all required shipping fields', 'error');
      return;
    }

    setSubmitting(true);

    try {
      // Structure order items array for server validation
      const orderItems = cart.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity
      }));

      const payload = {
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        orderItems,
        paymentMethod,
        notes: formData.notes
      };

      const res = await api.createOrder(payload);

      if (res.success && res.order) {
        clearCart();
        addToast('Order confirmed! Generating your ritual receipt.');
        // Navigate to unique confirmation screen with order data
        navigate(`/order-confirmation/${res.order.orderNumber}`, {
          state: { order: res.order }
        });
      }
    } catch (err) {
      console.error('Order creation failed:', err);
      setErrorMessage(err.message || 'Failed to place order. Please check stock availability.');
      addToast(err.message || 'Order failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Checkout Header */}
      <div className="mb-10 text-center sm:text-left">
        <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block mb-1">
          Secure Ritual Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-cocoa font-normal">
          Shipping & Demonstration Order
        </h1>
      </div>

      {/* Demonstration Banner Alert */}
      <div className="bg-blush-light border border-blush p-4 rounded-2xl mb-8 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-rose-dark flex-shrink-0 mt-0.5" />
        <div className="text-xs text-cocoa leading-relaxed font-light">
          <strong className="font-medium text-cocoa block mb-0.5">
            Academic Project Demonstration Flow
          </strong>
          This checkout creates a genuine order record in MongoDB and updates real stock inventories. No real payment will be charged to any card.
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-100 border border-rose-300 p-4 rounded-2xl mb-8 flex items-center gap-3 text-xs text-cocoa">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Contact, Shipping, Payment Demo */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Customer Info */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cream">
              <h2 className="font-serif text-xl text-cocoa font-normal">1. Contact Information</h2>
              {!isAuthenticated && (
                <Link to="/login" className="text-xs text-rose-dark hover:underline font-medium">
                  Already a member? Sign in
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-taupe block mb-1.5 font-medium">
                  Full Name <span className="text-rose-dark">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Elena Vance"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-taupe block mb-1.5 font-medium">
                  Email Address <span className="text-rose-dark">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. elena@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-taupe block mb-1.5 font-medium">
                  Phone Number (for delivery updates)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Address */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream shadow-xs space-y-4">
            <h2 className="font-serif text-xl text-cocoa font-normal pb-3 border-b border-cream">
              2. Shipping Destination
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs text-taupe block mb-1.5 font-medium">
                  Street Address & Apartment <span className="text-rose-dark">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 42 Lotus Promenade, Apt 5B"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-taupe block mb-1.5 font-medium">
                  City <span className="text-rose-dark">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-taupe block mb-1.5 font-medium">
                  State <span className="text-rose-dark">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Maharashtra"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-taupe block mb-1.5 font-medium">
                  Postal Code (PIN) <span className="text-rose-dark">*</span>
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="e.g. 400050"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-taupe block mb-1.5 font-medium">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  disabled
                  value={formData.country}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-cream/30 cursor-not-allowed outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-taupe block mb-1.5 font-medium">
                  Ritual Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Leave with security / Ring apartment bell"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Demonstration Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cream">
              <h2 className="font-serif text-xl text-cocoa font-normal">
                3. Demonstration Payment Method
              </h2>
              <span className="text-[10px] uppercase tracking-luxury text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                Zero Charge Demo
              </span>
            </div>

            <div className="space-y-3">
              {/* Demo Card Option */}
              <label
                className={`flex items-start p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'demo_card'
                    ? 'border-cocoa bg-ivory/60 shadow-xs'
                    : 'border-cream hover:border-blush'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="demo_card"
                  checked={paymentMethod === 'demo_card'}
                  onChange={() => setPaymentMethod('demo_card')}
                  className="mt-1 mr-3 text-cocoa focus:ring-cocoa"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cocoa">
                      Demonstration Credit / Debit Card
                    </span>
                    <CreditCard className="w-4 h-4 text-taupe" />
                  </div>
                  <p className="text-[11px] text-taupe mt-1 font-light">
                    Simulates immediate payment completion. Ready to integrate Stripe/Razorpay in production.
                  </p>
                </div>
              </label>

              {/* Demo UPI Option */}
              <label
                className={`flex items-start p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'demo_upi'
                    ? 'border-cocoa bg-ivory/60 shadow-xs'
                    : 'border-cream hover:border-blush'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="demo_upi"
                  checked={paymentMethod === 'demo_upi'}
                  onChange={() => setPaymentMethod('demo_upi')}
                  className="mt-1 mr-3 text-cocoa focus:ring-cocoa"
                />
                <div className="flex-1">
                  <span className="text-xs font-semibold text-cocoa">
                    Demonstration UPI / NetBanking
                  </span>
                  <p className="text-[11px] text-taupe mt-1 font-light">
                    Simulates instant UPI transfer with demonstration confirmation receipt.
                  </p>
                </div>
              </label>

              {/* Cash On Delivery */}
              <label
                className={`flex items-start p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-cocoa bg-ivory/60 shadow-xs'
                    : 'border-cream hover:border-blush'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 mr-3 text-cocoa focus:ring-cocoa"
                />
                <div className="flex-1">
                  <span className="text-xs font-semibold text-cocoa">
                    Cash on Delivery (COD)
                  </span>
                  <p className="text-[11px] text-taupe mt-1 font-light">
                    Pay upon arrival of your package.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order CTA */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream shadow-xs sticky top-32 space-y-6">
            <h2 className="font-serif text-2xl text-cocoa font-normal pb-3 border-b border-cream">
              Order Summary
            </h2>

            {/* Itemized List */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product._id} className="flex gap-3">
                  <div className="w-14 h-16 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                    <ImageFallback
                      src={item.product.images?.[0]}
                      alt={item.product.name}
                      category={item.product.category}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm text-cocoa truncate font-medium">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-taupe">Qty: {item.quantity}</p>
                    <p className="text-xs font-medium text-cocoa mt-0.5">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-cream space-y-2 text-xs">
              <div className="flex justify-between text-taupe">
                <span>Subtotal ({cart.length} formulations)</span>
                <span className="text-cocoa font-medium">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-taupe">
                <span>Complimentary Delivery</span>
                <span className="text-cocoa font-medium">
                  {shippingCharge === 0 ? (
                    <span className="text-emerald-700 font-semibold">Free</span>
                  ) : (
                    `₹${shippingCharge.toLocaleString('en-IN')}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-cocoa pt-3 border-t border-cream">
                <span>Total Due</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary rounded-xl py-4 flex items-center justify-center gap-2 group shadow-soft"
            >
              <span>{submitting ? 'Confirming in Database...' : 'Confirm Demonstration Order'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-taupe pt-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Full-Stack Verified • MongoDB Recorded</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
