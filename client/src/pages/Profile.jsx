import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, User, Clock, CheckCircle2, ChevronRight, LogOut, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { ImageFallback } from '../components/ImageFallback';

export const Profile = () => {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // orders | settings
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Settings form
  const [name, setName] = useState(user?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.getMyOrders();
        setOrders(res.orders || []);
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const payload = { name };
      if (newPassword) payload.password = newPassword;
      const res = await updateProfile(payload);
      addToast(res.message || 'Profile updated successfully!');
      setNewPassword('');
    } catch (err) {
      addToast(err.message || 'Update failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Account Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center text-cocoa font-serif text-2xl font-medium border border-rose/30">
            {user.name?.charAt(0) || 'R'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl text-cocoa font-normal">
                {user.name}
              </h1>
              {user.role === 'admin' && (
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-taupe font-light">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <Link to="/admin" className="btn-secondary rounded-xl text-xs flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          )}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="btn-outline rounded-xl text-xs flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-cream gap-6 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs uppercase tracking-luxury font-medium transition-colors border-b-2 ${
            activeTab === 'orders' ? 'border-cocoa text-cocoa font-semibold' : 'border-transparent text-taupe'
          }`}
        >
          My Order History ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 text-xs uppercase tracking-luxury font-medium transition-colors border-b-2 ${
            activeTab === 'settings' ? 'border-cocoa text-cocoa font-semibold' : 'border-transparent text-taupe'
          }`}
        >
          Profile Settings
        </button>
      </div>

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="py-12 text-center text-taupe animate-pulse text-sm">
              Retrieving your orders from MongoDB...
            </div>
          ) : orders.length > 0 ? (
            orders.map((ord) => (
              <div
                key={ord._id}
                className="bg-white rounded-3xl p-6 border border-cream shadow-xs hover:border-blush transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cream">
                  <div>
                    <span className="text-[10px] text-taupe uppercase tracking-wider block">Order Receipt</span>
                    <span className="font-mono text-sm font-semibold text-cocoa">{ord.orderNumber}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-taupe uppercase tracking-wider block">Date Placed</span>
                    <span className="text-xs text-cocoa">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-taupe uppercase tracking-wider block">Status</span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800'
                          : ord.orderStatus === 'Shipped'
                          ? 'bg-blue-50 text-blue-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-taupe uppercase tracking-wider block">Total</span>
                    <span className="font-medium text-sm text-cocoa">₹{ord.total?.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="py-4 space-y-3">
                  {ord.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
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
                          <span className="text-[11px] text-taupe">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-cocoa">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-cream flex items-center justify-between text-xs">
                  <span className="text-taupe font-light">
                    Tracking: <strong className="text-cocoa font-mono">{ord.trackingNumber || 'Pending'}</strong>
                  </span>
                  <Link
                    to={`/order-confirmation/${ord.orderNumber}`}
                    className="text-rose-dark hover:underline font-medium flex items-center gap-1"
                  >
                    <span>View Receipt</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-cream text-taupe">
              <Package className="w-10 h-10 mx-auto mb-3 text-taupe/60" />
              <h3 className="font-serif text-2xl text-cocoa mb-2">No Ritual Orders Yet</h3>
              <p className="text-xs text-taupe max-w-sm mx-auto mb-6 font-light">
                When you place orders, they will appear here with live tracking updates from MongoDB.
              </p>
              <Link to="/shop" className="btn-primary rounded-xl">
                Explore The Collection
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream shadow-xs max-w-xl">
          <h2 className="font-serif text-2xl text-cocoa mb-4">Edit Profile</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="text-xs text-taupe block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-taupe block mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-taupe bg-cream/30 cursor-not-allowed outline-none"
              />
              <span className="text-[10px] text-taupe mt-1 block">Email address cannot be changed directly.</span>
            </div>

            <div>
              <label className="text-xs text-taupe block mb-1">New Password (leave blank to keep current)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="btn-primary rounded-xl text-xs"
            >
              {updating ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
