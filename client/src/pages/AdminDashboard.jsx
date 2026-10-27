import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  Clock,
  Sparkles,
  Inbox
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ImageFallback } from '../components/ImageFallback';

export const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // overview | products | orders | messages | customers
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product Modal (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    tagline: '',
    shortDescription: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Serums',
    volume: '50 ml / 1.7 fl. oz.',
    imageUrl: '',
    stockQuantity: 25,
    isFeatured: false,
    ingredients: '',
    directions: ''
  });
  const [savingProduct, setSavingProduct] = useState(false);

  // Route protection
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login', { state: { from: { pathname: '/admin' } } });
      } else if (!isAdmin) {
        addToast('Access denied: Administrator privileges required.', 'error');
        navigate('/profile');
      }
    }
  }, [user, isAdmin, authLoading, navigate, addToast]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, ordersRes, messagesRes, customersRes] = await Promise.all([
        api.getAdminStats(),
        api.getProducts({ limit: 100 }),
        api.getAllOrders({ limit: 100 }),
        api.getContactMessages().catch(() => ({ messages: [] })),
        api.getAdminUsers().catch(() => ({ users: [] }))
      ]);

      setStats(statsRes.stats);
      setProducts(productsRes.products || []);
      setOrders(ordersRes.orders || []);
      setMessages(messagesRes.messages || []);
      setCustomers(customersRes.users || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      addToast(err.message || 'Error loading dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [isAdmin]);

  // Open Add Product modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      tagline: '',
      shortDescription: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 'Serums',
      volume: '50 ml / 1.7 fl. oz.',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      stockQuantity: 25,
      isFeatured: false,
      ingredients: 'Water/Aqua, Niacinamide, Glycerin, Sodium Hyaluronate, Botanical Ceramides.',
      directions: 'Smooth 2-3 drops over cleansed skin.'
    });
    setIsProductModalOpen(true);
  };

  // Open Edit Product modal
  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      tagline: prod.tagline || '',
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      category: prod.category,
      volume: prod.volume || '',
      imageUrl: prod.images?.[0] || '',
      stockQuantity: prod.stockQuantity,
      isFeatured: prod.isFeatured || false,
      ingredients: prod.ingredients || '',
      directions: prod.directions || ''
    });
    setIsProductModalOpen(true);
  };

  // Save product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const payload = {
        name: productForm.name,
        tagline: productForm.tagline,
        shortDescription: productForm.shortDescription || productForm.description.slice(0, 100),
        description: productForm.description,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
        category: productForm.category,
        volume: productForm.volume,
        images: [productForm.imageUrl],
        stockQuantity: Number(productForm.stockQuantity),
        isFeatured: Boolean(productForm.isFeatured),
        ingredients: productForm.ingredients,
        directions: productForm.directions
      };

      if (editingProduct) {
        const res = await api.updateProduct(editingProduct._id, payload);
        addToast(`Updated formulation: "${res.product.name}" in MongoDB`);
      } else {
        const res = await api.createProduct(payload);
        addToast(`Created formulation: "${res.product.name}" in MongoDB!`);
      }

      setIsProductModalOpen(false);
      loadAllAdminData();
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error');
    } finally {
      setSavingProduct(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to permanently delete "${productName}" from MongoDB?`)) {
      try {
        await api.deleteProduct(productId);
        addToast(`Deleted "${productName}" from catalogue`);
        loadAllAdminData();
      } catch (err) {
        addToast(err.message || 'Delete failed', 'error');
      }
    }
  };

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, { orderStatus: newStatus });
      addToast(`Order status updated to ${newStatus}`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      addToast(err.message || 'Status update failed', 'error');
    }
  };

  if (authLoading || (!isAdmin && user)) {
    return (
      <div className="pt-36 pb-24 text-center text-taupe animate-pulse text-sm">
        Verifying administrator authorization credentials...
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-cream">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium">
              Administrator Management Portal
            </span>
            <span className="text-[10px] bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded-full">
              Live MongoDB
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-cocoa font-normal">
            Rossele Skin Brand Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllAdminData}
            disabled={loading}
            className="btn-outline rounded-xl text-xs flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync MongoDB</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="btn-primary rounded-xl text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Formulation</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-cream gap-8 mb-8 overflow-x-auto text-xs font-medium uppercase tracking-luxury">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'overview' ? 'border-cocoa text-cocoa font-semibold' : 'border-transparent text-taupe'
          }`}
        >
          Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'products' ? 'border-cocoa text-cocoa font-semibold' : 'border-transparent text-taupe'
          }`}
        >
          Formulations Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'orders' ? 'border-cocoa text-cocoa font-semibold' : 'border-transparent text-taupe'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'messages' ? 'border-cocoa text-cocoa font-semibold' : 'border-transparent text-taupe'
          }`}
        >
          Contact Messages ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'customers' ? 'border-cocoa text-cocoa font-semibold' : 'border-transparent text-taupe'
          }`}
        >
          Registered Customers ({customers.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & LIVE METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-cream shadow-xs">
              <div className="flex items-center justify-between text-taupe mb-2">
                <span className="text-xs uppercase tracking-wider font-medium">Recorded Revenue</span>
                <span className="w-8 h-8 rounded-full bg-blush flex items-center justify-center text-cocoa font-sans font-bold text-sm">
                  ₹
                </span>
              </div>
              <span className="font-sans text-3xl font-semibold text-cocoa block">
                ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-taupe mt-1 block">Calculated from confirmed orders</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-cream shadow-xs">
              <div className="flex items-center justify-between text-taupe mb-2">
                <span className="text-xs uppercase tracking-wider font-medium">Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-rose-dark" />
              </div>
              <span className="font-sans text-3xl font-semibold text-cocoa block">
                {stats?.totalOrders || 0}
              </span>
              <span className="text-[11px] text-taupe mt-1 block">Recorded in database</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-cream shadow-xs">
              <div className="flex items-center justify-between text-taupe mb-2">
                <span className="text-xs uppercase tracking-wider font-medium">Active Formulations</span>
                <Package className="w-4 h-4 text-rose-dark" />
              </div>
              <span className="font-sans text-3xl font-semibold text-cocoa block">
                {stats?.totalProducts || 0}
              </span>
              <span className="text-[11px] text-taupe mt-1 block">Across 4 skincare categories</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-cream shadow-xs">
              <div className="flex items-center justify-between text-taupe mb-2">
                <span className="text-xs uppercase tracking-wider font-medium">Registered Clients</span>
                <Users className="w-4 h-4 text-rose-dark" />
              </div>
              <span className="font-sans text-3xl font-semibold text-cocoa block">
                {stats?.totalUsers || 0}
              </span>
              <span className="text-[11px] text-taupe mt-1 block">Active user accounts</span>
            </div>
          </div>

          {/* Low Stock Alert Table */}
          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 bg-amber-50/20 shadow-xs">
              <div className="flex items-center gap-2 mb-4 text-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-xl font-normal">
                  Low Stock Inventory Warning ({stats.lowStockProducts.length} items)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-amber-200 text-taupe">
                      <th className="py-2">Formulation</th>
                      <th className="py-2">Category</th>
                      <th className="py-2">Price</th>
                      <th className="py-2">Stock Remaining</th>
                      <th className="py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {stats.lowStockProducts.map((p) => (
                      <tr key={p._id} className="text-cocoa">
                        <td className="py-3 font-medium font-serif text-sm">{p.name}</td>
                        <td className="py-3 text-taupe">{p.category}</td>
                        <td className="py-3 font-medium">₹{p.price?.toLocaleString('en-IN')}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900">
                            {p.stockQuantity} units left
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="text-rose-dark hover:underline font-medium"
                          >
                            Restock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream shadow-xs">
            <h3 className="font-serif text-2xl text-cocoa font-normal mb-4">
              Recent Customer Orders
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-cream text-taupe">
                    <th className="py-2">Receipt</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Order Status</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream/60">
                  {stats?.recentOrders?.map((ord) => (
                    <tr key={ord._id} className="text-cocoa">
                      <td className="py-3 font-mono font-medium">{ord.orderNumber}</td>
                      <td className="py-3 font-medium">{ord.customerInfo?.name}</td>
                      <td className="py-3 font-medium">₹{ord.total?.toLocaleString('en-IN')}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cream text-cocoa">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-taupe">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-cocoa font-normal">Catalogue Inventory</h2>
              <p className="text-xs text-taupe">Add, edit, or adjust inventory pricing for the online boutique.</p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="btn-primary rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Formulation</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cream text-taupe uppercase tracking-wider text-[10px]">
                  <th className="py-3">Preview</th>
                  <th className="py-3">Formulation Name</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Stock</th>
                  <th className="py-3">Featured</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream/70">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-ivory/40 transition-colors">
                    <td className="py-3">
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                        <ImageFallback
                          src={p.images?.[0]}
                          alt={p.name}
                          category={p.category}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 font-medium text-cocoa">
                      <Link
                        to={`/products/${p.slug || p._id}`}
                        target="_blank"
                        className="hover:text-rose-dark flex items-center gap-1 font-serif text-sm"
                      >
                        <span>{p.name}</span>
                        <ExternalLink className="w-3 h-3 text-taupe" />
                      </Link>
                      <span className="text-[10px] text-taupe block">{p.volume}</span>
                    </td>
                    <td className="py-3 text-taupe">{p.category}</td>
                    <td className="py-3 font-medium text-cocoa">₹{p.price?.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          p.stockQuantity <= 10
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {p.stockQuantity} in stock
                      </span>
                    </td>
                    <td className="py-3">
                      {p.isFeatured ? (
                        <span className="text-emerald-700 font-bold text-xs">Yes</span>
                      ) : (
                        <span className="text-taupe text-xs">No</span>
                      )}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 rounded-lg border border-cream hover:bg-blush text-cocoa transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id, p.name)}
                        className="p-1.5 rounded-lg border border-cream hover:bg-rose-100 text-rose-700 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream shadow-xs space-y-6">
          <div>
            <h2 className="font-serif text-2xl text-cocoa font-normal">Customer Orders</h2>
            <p className="text-xs text-taupe">Track and update dispatch statuses recorded in MongoDB.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cream text-taupe uppercase tracking-wider text-[10px]">
                  <th className="py-3">Receipt #</th>
                  <th className="py-3">Client</th>
                  <th className="py-3">Items</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream/70">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-ivory/40 transition-colors">
                    <td className="py-3 font-mono font-medium text-cocoa">
                      <Link
                        to={`/order-confirmation/${ord.orderNumber}`}
                        target="_blank"
                        className="hover:underline flex items-center gap-1 text-rose-dark"
                      >
                        <span>{ord.orderNumber}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                    <td className="py-3">
                      <strong className="text-cocoa font-medium block">{ord.customerInfo?.name}</strong>
                      <span className="text-[10px] text-taupe">{ord.customerInfo?.email}</span>
                    </td>
                    <td className="py-3 text-taupe">
                      {ord.orderItems?.length} items ({ord.orderItems?.map((i) => i.name).join(', ').slice(0, 30)}...)
                    </td>
                    <td className="py-3 font-medium text-cocoa">₹{ord.total?.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800'
                            : ord.orderStatus === 'Shipped'
                            ? 'bg-blue-50 text-blue-800'
                            : ord.orderStatus === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="px-2 py-1 rounded-lg border border-cream text-xs text-cocoa bg-ivory focus:border-rose outline-none cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CONTACT MESSAGES */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream shadow-xs space-y-6">
          <div>
            <h2 className="font-serif text-2xl text-cocoa font-normal">Customer Inquiries</h2>
            <p className="text-xs text-taupe">Messages submitted through the public Contact page.</p>
          </div>

          {messages.length > 0 ? (
            <div className="divide-y divide-cream">
              {messages.map((msg) => (
                <div key={msg._id} className="py-4 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <strong className="text-cocoa font-medium text-sm">{msg.subject}</strong>
                    <span className="text-[11px] text-taupe">
                      {new Date(msg.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-taupe">
                    From: <strong className="text-cocoa">{msg.name}</strong> ({msg.email})
                  </p>
                  <p className="text-xs text-cocoa/90 bg-ivory/60 p-3 rounded-xl border border-cream/80 mt-2 font-light">
                    "{msg.message}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-taupe">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No customer inquiries submitted yet.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: REGISTERED CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-cocoa font-normal">Registered Customers</h2>
              <p className="text-xs text-taupe">Accounts created and stored in MongoDB.</p>
            </div>
            <span className="text-xs bg-blush text-cocoa px-3 py-1 rounded-full font-medium self-start sm:self-auto">
              Total Clients: {customers.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cream text-taupe uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Orders Placed</th>
                  <th className="pb-3 font-medium">Member Since</th>
                  <th className="pb-3 font-medium text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-ivory/50 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blush flex items-center justify-center text-cocoa font-semibold text-xs border border-blush-dark/30">
                          {c.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-cocoa">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-taupe">{c.email}</td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          c.role === 'admin'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {c.role}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-cocoa">
                      {c.orderCount || 0} {c.orderCount === 1 ? 'order' : 'orders'}
                    </td>
                    <td className="py-3.5 pr-4 text-taupe">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCT ADD / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-cocoa/50 backdrop-blur-xs" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative min-h-screen px-4 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-cream shadow-float relative z-10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-cream mb-6">
                <h3 className="font-serif text-2xl text-cocoa font-normal">
                  {editingProduct ? 'Edit Formulation' : 'Create New Formulation'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 rounded-full text-taupe hover:text-cocoa"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="text-taupe block mb-1 font-medium">Formulation Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Dew Veil Hydrating Serum"
                    className="w-full px-3 py-2 rounded-xl border border-cream text-cocoa bg-ivory/50 focus:border-rose outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-taupe block mb-1 font-medium">Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-cream text-cocoa bg-ivory/50 focus:border-rose outline-none cursor-pointer"
                    >
                      <option value="Serums">Serums</option>
                      <option value="Moisturizers">Moisturizers</option>
                      <option value="Cleansers">Cleansers</option>
                      <option value="Lip Care">Lip Care</option>
                      <option value="Toners & Mists">Toners & Mists</option>
                      <option value="Sun Care">Sun Care</option>
                      <option value="Eye & Targeted">Eye & Targeted</option>
                      <option value="Masks & Treatments">Masks & Treatments</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-taupe block mb-1 font-medium">Volume / Size</label>
                    <input
                      type="text"
                      value={productForm.volume}
                      onChange={(e) => setProductForm({ ...productForm, volume: e.target.value })}
                      placeholder="e.g. 50 ml / 1.7 fl. oz."
                      className="w-full px-3 py-2 rounded-xl border border-cream text-cocoa bg-ivory/50 focus:border-rose outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-taupe block mb-1 font-medium">Price in INR (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="1850"
                      className="w-full px-3 py-2 rounded-xl border border-cream text-cocoa bg-ivory/50 focus:border-rose outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-taupe block mb-1 font-medium">Stock Inventory *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productForm.stockQuantity}
                      onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                      placeholder="25"
                      className="w-full px-3 py-2 rounded-xl border border-cream text-cocoa bg-ivory/50 focus:border-rose outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-taupe block mb-1 font-medium">Image URL</label>
                  <input
                    type="url"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 rounded-xl border border-cream text-cocoa bg-ivory/50 focus:border-rose outline-none"
                  />
                  <span className="text-[10px] text-taupe block mt-0.5">
                    If left blank, an attractive minimalist aesthetic bottle fallback will be rendered automatically.
                  </span>
                </div>

                <div>
                  <label className="text-taupe block mb-1 font-medium">Short Tagline</label>
                  <input
                    type="text"
                    value={productForm.tagline}
                    onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                    placeholder="Weightless moisture with a glass-skin finish"
                    className="w-full px-3 py-2 rounded-xl border border-cream text-cocoa bg-ivory/50 focus:border-rose outline-none"
                  />
                </div>

                <div>
                  <label className="text-taupe block mb-1 font-medium">Full Description *</label>
                  <textarea
                    required
                    rows="3"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Describe texture, skin feel, and sensory benefits..."
                    className="w-full px-3 py-2 rounded-xl border border-cream text-cocoa bg-ivory/50 focus:border-rose outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="rounded text-cocoa focus:ring-cocoa"
                  />
                  <label htmlFor="isFeatured" className="text-cocoa font-medium cursor-pointer">
                    Feature on Homepage (Bestsellers Showcase)
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-cream">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="btn-outline rounded-xl flex-1 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProduct}
                    className="btn-primary rounded-xl flex-1 text-xs"
                  >
                    {savingProduct ? 'Persisting to MongoDB...' : editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
