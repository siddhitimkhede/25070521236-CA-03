import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, MapPin, Printer, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { ImageFallback } from '../components/ImageFallback';

export const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    // Trigger festive celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F3D9D8', '#D9AAA8', '#FAF7F2', '#493633']
    });

    const fetchOrderDetails = async () => {
      if (!order && orderNumber) {
        try {
          const res = await api.getOrder(orderNumber);
          setOrder(res.order);
        } catch (err) {
          console.error('Failed to load order receipt:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [orderNumber, order]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="pt-36 pb-24 text-center max-w-md mx-auto px-4">
        <p className="text-sm text-taupe animate-pulse">Loading order confirmation receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-36 pb-24 text-center max-w-md mx-auto px-4">
        <h2 className="font-serif text-3xl text-cocoa mb-2">Order Receipt Not Found</h2>
        <p className="text-xs text-taupe mb-6">Could not retrieve order details for #{orderNumber}.</p>
        <Link to="/shop" className="btn-primary rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Success Header */}
      <div className="text-center space-y-4 mb-10">
        <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center mx-auto text-rose-dark shadow-soft">
          <CheckCircle2 className="w-8 h-8 text-cocoa" />
        </div>
        <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block">
          Order Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-cocoa">
          Thank you for your ritual order.
        </h1>
        <p className="text-sm text-taupe font-light max-w-md mx-auto leading-relaxed">
          A confirmation receipt has been generated and recorded in MongoDB. Your daily essentials are being carefully prepared.
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream shadow-card space-y-8">
        
        {/* Receipt Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-cream">
          <div>
            <span className="text-[11px] text-taupe uppercase tracking-wider block">Receipt Number</span>
            <span className="font-mono text-base font-semibold text-cocoa">{order.orderNumber}</span>
          </div>

          <div>
            <span className="text-[11px] text-taupe uppercase tracking-wider block">Status</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              {order.orderStatus} • {order.paymentStatus}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-taupe uppercase tracking-wider block">Tracking ID</span>
            <span className="font-mono text-xs text-cocoa font-medium">{order.trackingNumber || 'Assigned upon dispatch'}</span>
          </div>
        </div>

        {/* Shipping Destination & Customer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-cocoa">
          <div className="p-4 rounded-2xl bg-ivory/60 border border-cream">
            <span className="font-medium text-cocoa block mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-dark" />
              Shipping Destination
            </span>
            <p className="text-taupe font-light leading-relaxed">
              {order.customerInfo?.name}<br />
              {order.shippingAddress?.address}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
              {order.shippingAddress?.country}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-ivory/60 border border-cream">
            <span className="font-medium text-cocoa block mb-1 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-rose-dark" />
              Delivery Details
            </span>
            <p className="text-taupe font-light leading-relaxed">
              Email: {order.customerInfo?.email}<br />
              Phone: {order.customerInfo?.phone || 'Not provided'}<br />
              Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Demonstration Card'}<br />
              Order Date: {new Date(order.createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Ordered Formulations List */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl text-cocoa font-normal">
            Your Formulations
          </h3>
          <div className="divide-y divide-cream/70 border-y border-cream">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                    <ImageFallback
                      src={item.image}
                      alt={item.name}
                      category="Ritual"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm text-cocoa font-medium">{item.name}</h4>
                    <span className="text-[11px] text-taupe font-light">Quantity: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-medium text-xs text-cocoa">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="space-y-2 text-xs pt-2">
          <div className="flex justify-between text-taupe">
            <span>Subtotal</span>
            <span className="font-medium text-cocoa">₹{order.subtotal?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-taupe">
            <span>Delivery</span>
            <span className="font-medium text-cocoa">
              {order.shippingCharge === 0 ? 'Complimentary' : `₹${order.shippingCharge?.toLocaleString('en-IN')}`}
            </span>
          </div>
          <div className="flex justify-between text-base font-semibold text-cocoa pt-3 border-t border-cream">
            <span>Total Amount</span>
            <span>₹{order.total?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-cream flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrint}
            className="btn-outline rounded-xl flex-1 flex items-center justify-center gap-2 text-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <Link
            to="/shop"
            className="btn-primary rounded-xl flex-1 flex items-center justify-center gap-2 text-xs"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
