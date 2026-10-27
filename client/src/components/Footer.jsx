import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Instagram, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const { addToast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    setStatus('loading');
    try {
      const res = await api.subscribeNewsletter(email);
      setStatus('success');
      addToast(res.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err) {
      setStatus('error');
      addToast(err.message || 'Subscription failed', 'error');
    }
  };

  return (
    <footer className="bg-cream/50 border-t border-blush/60 pt-16 pb-12 mt-20 text-cocoa">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-cream">
          {/* Brand Intro */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-serif text-3xl tracking-[0.2em] uppercase text-cocoa block">
              ROSSELE SKIN
            </span>
            <p className="text-sm text-taupe leading-relaxed font-light max-w-sm">
              Your skin, your softest ritual. Thoughtfully designed essentials that nourish, hydrate, and calm your natural barrier every single day.
            </p>
            <div className="flex items-center gap-2 text-xs text-rose-dark uppercase tracking-luxury font-medium pt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack FLEXI Academic Project</span>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-7 bg-white/70 p-6 sm:p-8 rounded-3xl border border-blush/40 backdrop-blur-xs">
            <div className="max-w-md">
              <h3 className="font-serif text-2xl text-cocoa mb-1.5 font-normal">
                A little glow in your inbox.
              </h3>
              <p className="text-xs text-taupe mb-4 font-light leading-relaxed">
                Receive secret ritual drops, skincare masterclasses, and private access to our seasonal batches.
              </p>

              {status === 'success' ? (
                <div className="flex items-center gap-2 p-3 bg-blush-light rounded-xl text-xs text-cocoa font-medium">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Welcome to our inner circle. Check your inbox soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 px-4 py-3 rounded-xl border border-cream text-xs text-cocoa placeholder:text-taupe focus:border-rose outline-none bg-ivory/50"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary rounded-xl whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <span>{status === 'loading' ? 'Joining...' : 'Subscribe'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Links Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-cream text-xs">
          <div>
            <h4 className="font-serif text-base text-cocoa uppercase tracking-luxury font-medium mb-4">
              Collection
            </h4>
            <ul className="space-y-2.5 text-taupe font-light">
              <li><Link to="/shop" className="hover:text-cocoa transition-colors">Shop All Products</Link></li>
              <li><Link to="/shop?category=Cleansers" className="hover:text-cocoa transition-colors">Cleansers</Link></li>
              <li><Link to="/shop?category=Serums" className="hover:text-cocoa transition-colors">Dew Serums</Link></li>
              <li><Link to="/shop?category=Moisturizers" className="hover:text-cocoa transition-colors">Barrier Creams</Link></li>
              <li><Link to="/shop?category=Lip%20Care" className="hover:text-cocoa transition-colors">Glaze Lip Care</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base text-cocoa uppercase tracking-luxury font-medium mb-4">
              The Brand
            </h4>
            <ul className="space-y-2.5 text-taupe font-light">
              <li><Link to="/story" className="hover:text-cocoa transition-colors">Our Story & Ethos</Link></li>
              <li><Link to="/#ritual" className="hover:text-cocoa transition-colors">The 3-Step Ritual</Link></li>
              <li><Link to="/contact" className="hover:text-cocoa transition-colors">Contact Concierge</Link></li>
              <li><Link to="/story#values" className="hover:text-cocoa transition-colors">Ingredient Standards</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base text-cocoa uppercase tracking-luxury font-medium mb-4">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-taupe font-light">
              <li><Link to="/wishlist" className="hover:text-cocoa transition-colors">Saved Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-cocoa transition-colors">Shopping Bag</Link></li>
              <li><Link to="/profile" className="hover:text-cocoa transition-colors">Track Order & Account</Link></li>
              <li><Link to="/contact" className="hover:text-cocoa transition-colors">Client Concierge & FAQs</Link></li>
              <li><Link to="/admin" className="hover:text-rose-dark transition-colors font-medium">Admin Portal</Link></li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem('rossele_intro_shown');
                    window.location.href = '/';
                  }}
                  className="hover:text-rose-dark transition-colors text-left text-[11px] text-rose-dark/90 font-medium pt-1 block"
                >
                  ✦ Replay Brand Intro
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base text-cocoa uppercase tracking-luxury font-medium mb-4">
              Connect
            </h4>
            <p className="text-taupe leading-relaxed mb-3 font-light">
              Follow our aesthetic journey and daily ritual moments.
            </p>
            <div className="flex gap-3 text-cocoa">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-cream flex items-center justify-center hover:bg-blush transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Academic Demo Disclosure */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-taupe/80 gap-4">
          <p>
            © {new Date().getFullYear()} ROSSELE SKIN INC. All rights reserved. Made for university FLEXI demonstration.
          </p>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider">
            <span className="text-cocoa font-medium">Demonstration Platform</span>
            <span>•</span>
            <span>Prices in INR (₹)</span>
            <span>•</span>
            <span>MongoDB Compass Integrated</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
