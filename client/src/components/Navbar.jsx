import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, Shield, LogOut, ChevronDown, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { SearchModal } from './SearchModal';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const { totalItems, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  // Scroll detection for sticky header transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Bestsellers', path: '/#bestsellers' },
    { name: 'Skincare Rituals', path: '/#rituals' },
    { name: 'About', path: '/story' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40">
        {/* Minimalist Announcement Bar */}
        <div className="bg-blush text-cocoa py-2 px-4 text-center text-xs tracking-luxury uppercase font-medium border-b border-blush-dark/30 transition-all">
          <p className="animate-pulse">
            Your everyday ritual, a little more beautiful. Complimentary delivery above ₹1,500.
          </p>
        </div>

        {/* Main Navbar */}
        <nav
          className={`transition-all duration-300 ${
            isScrolled
              ? 'bg-ivory/95 backdrop-blur-md shadow-soft border-b border-cream/80 py-3.5'
              : 'bg-ivory/80 backdrop-blur-xs py-5'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Left: Mobile Menu Toggle & Desktop Navigation Links */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 text-cocoa hover:text-rose-dark transition-colors"
                aria-label="Toggle Navigation"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-xs uppercase tracking-luxury font-medium transition-colors hover:text-rose-dark relative py-1 ${
                      location.pathname === link.path ? 'text-cocoa font-semibold' : 'text-cocoa/80'
                    }`}
                  >
                    {link.name}
                    {location.pathname === link.path && (
                      <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-cocoa rounded-full" />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Center: Brand Wordmark Logo */}
            <Link
              to="/"
              className="text-center group flex flex-col items-center justify-center transform active:scale-[0.99] transition-transform"
            >
              <span className="font-serif text-2xl sm:text-3xl font-normal tracking-[0.22em] uppercase text-cocoa">
                ROSSELE SKIN
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-taupe font-light -mt-1 hidden sm:block">
                Softest Ritual
              </span>
            </Link>

            {/* Right: Actions (Search, Wishlist, Account, Bag) */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-cocoa hover:text-rose-dark transition-colors"
                aria-label="Search essentials"
              >
                <Search className="w-5 h-5 stroke-[1.75]" />
              </button>

              {/* Wishlist Link with Live Counter */}
              <Link
                to="/wishlist"
                className="relative p-2 text-cocoa hover:text-rose-dark transition-colors flex items-center"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.75]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-dark text-ivory text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="p-2 text-cocoa hover:text-rose-dark transition-colors flex items-center gap-1"
                  aria-label="User Account"
                >
                  <User className="w-5 h-5 stroke-[1.75]" />
                  {isAuthenticated && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-dark hidden sm:inline-block" />
                  )}
                </button>

                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-cream py-2 z-50 animate-fadeIn">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-cream">
                          <p className="text-xs text-taupe">Signed in as</p>
                          <p className="text-sm font-medium text-cocoa truncate">{user?.name}</p>
                          <span className="text-[10px] text-rose-dark uppercase tracking-wider font-semibold">
                            {user?.role}
                          </span>
                        </div>

                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2.5 text-xs text-cocoa hover:bg-cream/40 transition-colors"
                        >
                          <User className="w-4 h-4 text-taupe" />
                          <span>My Account & Orders</span>
                        </Link>

                        <Link
                          to="/wishlist"
                          className="flex items-center gap-2 px-4 py-2.5 text-xs text-cocoa hover:bg-cream/40 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-taupe" />
                          <span>My Saved Wishlist ({wishlistCount})</span>
                        </Link>

                        <Link
                          to="/cart"
                          className="flex items-center gap-2 px-4 py-2.5 text-xs text-cocoa hover:bg-cream/40 transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4 text-taupe" />
                          <span>View Full Bag ({totalItems})</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2.5 text-xs text-cocoa hover:bg-blush-light transition-colors font-medium text-rose-dark"
                          >
                            <Shield className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}

                        <div className="border-t border-cream my-1" />

                        <button
                          onClick={() => {
                            logout();
                            setIsAccountMenuOpen(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs text-rose-dark hover:bg-cream/40 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="p-3 text-center border-b border-cream bg-ivory/50">
                          <p className="font-serif text-base text-cocoa mb-1">Rossele Member</p>
                          <p className="text-[11px] text-taupe">Sign in to track orders and save routines.</p>
                        </div>
                        <Link
                          to="/login"
                          className="block px-4 py-2.5 text-xs text-cocoa hover:bg-cream/40 transition-colors font-medium"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2.5 text-xs text-cocoa hover:bg-cream/40 transition-colors"
                        >
                          Create Account
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center gap-2 px-4 py-2.5 text-xs text-cocoa hover:bg-cream/40 transition-colors border-t border-cream"
                        >
                          <Heart className="w-3.5 h-3.5 text-taupe" />
                          <span>Saved Wishlist ({wishlistCount})</span>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Shopping Bag Icon with live count badge */}
              <button
                onClick={openCart}
                className="relative p-2 text-cocoa hover:text-rose-dark transition-colors flex items-center"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-cocoa text-ivory text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[88px] bg-white z-40 flex flex-col p-6 animate-fadeIn overflow-y-auto">
            <div className="space-y-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block font-serif text-2xl text-cocoa hover:text-rose-dark py-2 border-b border-cream/50"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-serif text-2xl text-cocoa hover:text-rose-dark py-2 border-b border-cream/50 flex items-center justify-between"
              >
                <span>Saved Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="text-xs bg-blush text-rose-dark px-2.5 py-1 rounded-full font-sans font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-serif text-2xl text-cocoa hover:text-rose-dark py-2 border-b border-cream/50 flex items-center justify-between"
              >
                <span>Shopping Bag</span>
                {totalItems > 0 && (
                  <span className="text-xs bg-cocoa text-ivory px-2.5 py-1 rounded-full font-sans font-semibold">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>

            <div className="mt-auto pt-6 border-t border-cream space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-cocoa">{user?.name}</span>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-xs text-rose-dark underline"
                    >
                      Sign Out
                    </button>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-outline w-full rounded-xl text-center"
                  >
                    My Orders & Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-secondary w-full rounded-xl text-center"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-outline rounded-xl text-center text-xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary rounded-xl text-center text-xs"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Instant Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
