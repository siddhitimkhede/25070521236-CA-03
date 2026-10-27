import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, User as UserIcon, ArrowRight, Sparkles, AlertCircle, Eye, EyeOff, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Handle Login Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login({ email: loginEmail, password: loginPassword });
      addToast(res.message || 'Welcome back to Rossele Skin');
      sessionStorage.setItem('rossele_intro_shown', 'true');
      sessionStorage.setItem('rossele_guest_browsing', 'true');
      navigate(res.user?.role === 'admin' ? '/admin' : (from === '/login' ? '/' : from), { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration Submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const res = await register({ name: regName, email: regEmail, password: regPassword });
      addToast(res.message || 'Account created successfully! Welcome to Rossele Skin.');
      sessionStorage.setItem('rossele_intro_shown', 'true');
      sessionStorage.setItem('rossele_guest_browsing', 'true');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick autofill helpers for university evaluation
  const fillCustomerDemo = () => {
    setMode('login');
    setLoginEmail('elena@rosseleskin.com');
    setLoginPassword('Customer@2026');
  };

  const fillAdminDemo = () => {
    setMode('login');
    setLoginEmail('admin@rosseleskin.com');
    setLoginPassword('Admin@Rossele2026');
  };

  const handleContinueAsGuest = () => {
    sessionStorage.setItem('rossele_intro_shown', 'true');
    sessionStorage.setItem('rossele_guest_browsing', 'true');
    addToast('Browsing collection as guest');
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center">
      <div className="w-full bg-white rounded-3xl border border-cream shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-w-5xl">
        
        {/* Left Column: Form & Brand Messaging */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
          <div>
            {/* Brand Header */}
            <div className="mb-8">
              <span className="font-script text-4xl sm:text-5xl text-cocoa block mb-1" style={{ fontFamily: '"Pinyon Script", "Cormorant Garamond", cursive' }}>
                Rossele Skin
              </span>
              <p className="font-serif text-xs uppercase tracking-luxury text-rose-dark font-medium">
                Your skin, your softest ritual.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-cream mb-6">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`pb-3 text-xs uppercase tracking-luxury font-medium transition-colors border-b-2 mr-8 ${
                  mode === 'login'
                    ? 'border-cocoa text-cocoa font-semibold'
                    : 'border-transparent text-taupe hover:text-cocoa'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className={`pb-3 text-xs uppercase tracking-luxury font-medium transition-colors border-b-2 ${
                  mode === 'register'
                    ? 'border-cocoa text-cocoa font-semibold'
                    : 'border-transparent text-taupe hover:text-cocoa'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Academic Evaluation Quick-Fill Banner (Visible on Login mode) */}
            {mode === 'login' && (
              <div className="bg-blush-light p-3.5 rounded-2xl border border-blush/80 mb-6 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-rose-dark font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Academic Evaluation Quick-Fill</span>
                  </div>
                  <span className="text-[10px] text-taupe font-light">1-Click Auto Fill</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={fillCustomerDemo}
                    className="px-3 py-1.5 bg-white rounded-xl text-xs font-medium text-cocoa border border-blush hover:bg-blush transition-colors text-center shadow-xs"
                  >
                    Demo Customer
                  </button>
                  <button
                    type="button"
                    onClick={fillAdminDemo}
                    className="px-3 py-1.5 bg-white rounded-xl text-xs font-medium text-cocoa border border-blush hover:bg-blush transition-colors text-center shadow-xs"
                  >
                    Demo Admin
                  </button>
                </div>
              </div>
            )}

            {/* Error Message Pill */}
            {error && (
              <div className="bg-rose-100 border border-rose-300 p-3.5 rounded-2xl mb-6 flex items-center gap-2.5 text-xs text-cocoa">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. SIGN IN FORM */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-taupe block mb-1 font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-taupe absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="elena@rosseleskin.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-taupe font-medium">Password</label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-taupe absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-taupe hover:text-cocoa"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary rounded-xl py-3.5 flex items-center justify-center gap-2 text-xs shadow-soft mt-3"
                >
                  <span>{loading ? 'Authenticating with MongoDB...' : 'Sign In to Your Ritual'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* 2. REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-taupe block mb-1 font-medium">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-taupe absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Elena Vance"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-taupe block mb-1 font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-taupe absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-taupe block mb-1 font-medium">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-taupe absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min. 6 chars"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-taupe block mb-1 font-medium">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-taupe absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary rounded-xl py-3.5 flex items-center justify-center gap-2 text-xs shadow-soft mt-3"
                >
                  <span>{loading ? 'Creating Account in MongoDB...' : 'Create Rossele Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Guest Browsing Button & Security Guarantee */}
          <div className="mt-8 pt-6 border-t border-cream space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-taupe font-light">Prefer to look around first?</span>
              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="text-xs uppercase tracking-luxury font-medium text-cocoa hover:text-rose-dark transition-colors inline-flex items-center gap-1.5 underline underline-offset-4"
              >
                <span>Continue as Guest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-taupe/80 font-light">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-dark" />
              <span>Bcrypt 256-bit password hashing • Genuine Node.js & MongoDB JWT auth</span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Skincare Campaign Photograph */}
        <div className="hidden lg:block lg:col-span-5 relative bg-cream overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80"
            alt="Rossele Skin Editorial Campaign"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-cocoa/70 via-cocoa/20 to-transparent" />

          {/* Editorial quote overlay */}
          <div className="absolute bottom-8 inset-x-8 text-ivory space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-rose font-medium block">
              The Minimalist Philosophy
            </span>
            <p className="font-serif text-2xl font-normal leading-snug">
              "Less noise. More ritual. Skincare stripped to its softest essentials."
            </p>
            <div className="pt-2 flex items-center gap-3 text-[11px] text-ivory/80 font-light border-t border-white/20">
              <span>Skin-identical Lipids</span>
              <span>•</span>
              <span>100% Barrier Loving</span>
              <span>•</span>
              <span>Cruelty Free</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
