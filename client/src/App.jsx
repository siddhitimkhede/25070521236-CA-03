import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { BrandIntro } from './components/BrandIntro';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { OurStory } from './pages/OurStory';
import { Contact } from './pages/Contact';
import { AdminDashboard } from './pages/AdminDashboard';

// Scroll to top helper on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Root Entry Gate: Manages full-screen Brand Intro on initial visit, then Login gate
const RootEntryGate = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('rossele_intro_shown');
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem('rossele_intro_shown', 'true');
    setShowIntro(false);
    const hasGuest = sessionStorage.getItem('rossele_guest_browsing');
    if (!isAuthenticated && !hasGuest) {
      navigate('/login');
    }
  };

  if (showIntro) {
    return <BrandIntro onComplete={handleIntroComplete} />;
  }

  const hasGuest = sessionStorage.getItem('rossele_guest_browsing');
  if (!loading && !isAuthenticated && !hasGuest) {
    return <Navigate to="/login" replace />;
  }

  return <Home />;
};

// 404 Fallback
const NotFound = () => (
  <div className="pt-36 pb-24 text-center max-w-md mx-auto px-4">
    <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block mb-2">
      404 Error
    </span>
    <h2 className="font-serif text-4xl text-cocoa mb-3">Page Not Found</h2>
    <p className="text-xs text-taupe mb-8 font-light leading-relaxed">
      The ritual or formulation page you were looking for does not exist or has moved.
    </p>
    <a href="/" className="btn-primary rounded-xl text-xs">
      Return to Home
    </a>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <ScrollToTop />
              <div className="min-h-screen flex flex-col bg-ivory text-cocoa">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<RootEntryGate />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/products" element={<Shop />} />
                    <Route path="/products/:idOrSlug" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/story" element={<OurStory />} />
                    <Route path="/about" element={<OurStory />} />
                    <Route path="/about-us" element={<OurStory />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <CartDrawer />
                <Footer />
              </div>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
