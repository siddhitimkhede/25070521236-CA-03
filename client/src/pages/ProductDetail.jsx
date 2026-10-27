import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Plus,
  Minus,
  Star,
  Check,
  ShieldCheck,
  Droplets,
  Sparkles,
  ArrowRight,
  MessageSquare,
  ChevronDown,
  Heart
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { ImageFallback } from '../components/ImageFallback';
import { ProductCard } from '../components/ProductCard';

export const ProductDetail = () => {
  const { idOrSlug } = useParams();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('benefits'); // benefits | ingredients | usage

  // Review form state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState(user?.name || '');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const data = await api.getProduct(idOrSlug);
        setProduct(data.product);
        setReviews(data.reviews || []);
        setSelectedImage(0);
        setQuantity(1);

        // Fetch related products
        if (data.product?.category) {
          const related = await api.getProducts({
            category: data.product.category,
            limit: 4
          });
          setRelatedProducts(
            (related.products || []).filter((p) => p._id !== data.product._id)
          );
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
          <div className="lg:col-span-7 aspect-[4/5] bg-cream rounded-3xl" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 w-1/4 bg-cream rounded" />
            <div className="h-10 w-3/4 bg-cream rounded" />
            <div className="h-6 w-1/3 bg-cream rounded" />
            <div className="h-24 w-full bg-cream rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-36 pb-24 text-center max-w-md mx-auto px-4">
        <h2 className="font-serif text-3xl text-cocoa mb-3">Formulation Not Found</h2>
        <p className="text-xs text-taupe mb-6 font-light">
          The requested product may have been archived or is temporarily unavailable.
        </p>
        <Link to="/shop" className="btn-primary rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      addToast('Please enter a review message', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.createReview(product._id, {
        rating: reviewRating,
        customerName: reviewName || user?.name || 'Skincare Enthusiast',
        title: reviewTitle,
        comment: reviewComment
      });

      addToast(res.message || 'Review submitted successfully!');
      setReviews([res.review, ...reviews]);
      if (res.productRating) {
        setProduct((prev) => ({
          ...prev,
          rating: res.productRating,
          numReviews: res.productNumReviews
        }));
      }
      setIsReviewModalOpen(false);
      setReviewTitle('');
      setReviewComment('');
    } catch (err) {
      addToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-taupe mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-cocoa">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-cocoa">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-cocoa">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-cocoa font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-24">
        
        {/* Left: Product Imagery Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[580px] pb-2 sm:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-cream/40 ${
                    selectedImage === idx ? 'border-cocoa shadow-xs' : 'border-cream hover:border-blush'
                  }`}
                >
                  <ImageFallback
                    src={img}
                    alt={`${product.name} preview ${idx + 1}`}
                    category={product.category}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Selected Image */}
          <div className="flex-1 aspect-[4/5] rounded-3xl overflow-hidden bg-ivory shadow-card border border-cream relative">
            <ImageFallback
              src={product.images?.[selectedImage] || product.images?.[0]}
              alt={product.name}
              category={product.category}
              className="w-full h-full object-cover"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isFeatured && (
                <span className="bg-blush/90 backdrop-blur-sm text-cocoa text-xs uppercase tracking-luxury font-semibold px-3 py-1 rounded-full border border-blush-dark/30">
                  Ritual Essential
                </span>
              )}
              {isLowStock && (
                <span className="bg-rose-100 text-rose-800 text-xs uppercase tracking-wider font-medium px-3 py-1 rounded-full shadow-xs">
                  Only {product.stockQuantity} Remaining
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-taupe">
              <span className="uppercase tracking-luxury text-rose-dark font-medium">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5">
                <div className="flex text-rose-dark">
                  {Array(5).fill(0).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(product.rating || 5) ? 'fill-rose-dark' : 'text-cream'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-cocoa font-medium">
                  {product.rating || '5.0'} ({reviews.length} reviews)
                </span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-cocoa font-normal leading-tight">
              {product.name}
            </h1>

            <p className="text-xs uppercase tracking-luxury text-taupe font-medium">
              {product.volume}
            </p>

            {/* Price block */}
            <div className="flex items-baseline gap-3 py-2 border-y border-cream">
              <span className="font-sans text-2xl font-semibold text-cocoa">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-taupe line-through">
                  ₹{product.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-[11px] text-taupe ml-auto font-light">
                Taxes included. Free shipping over ₹1,500.
              </span>
            </div>

            <p className="text-sm text-taupe leading-relaxed font-light">
              {product.description}
            </p>

            {/* Stock status pill */}
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOutOfStock ? 'bg-cocoa' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              />
              <span className="text-cocoa font-medium">
                {isOutOfStock
                  ? 'Currently Out of Stock'
                  : isLowStock
                  ? `Low Stock — Only ${product.stockQuantity} units remaining`
                  : 'In Stock — Ready to dispatch in 24 hours'}
              </span>
            </div>

            {/* Quantity Selector & Add to Bag */}
            <div className="pt-4 space-y-3">
              <div className="flex gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-cream rounded-xl bg-ivory/40 overflow-hidden shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="p-3 text-cocoa hover:bg-cream transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-medium text-cocoa select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))}
                    disabled={isOutOfStock || quantity >= product.stockQuantity}
                    className="p-3 text-cocoa hover:bg-cream transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add To Bag CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 btn-primary rounded-xl py-4 flex items-center justify-center gap-2 shadow-soft ${
                    isOutOfStock ? 'opacity-50 cursor-not-allowed bg-taupe' : ''
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isOutOfStock
                      ? 'Out of Stock'
                      : `Add to Ritual Bag • ₹${(product.price * quantity).toLocaleString('en-IN')}`}
                  </span>
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  title={isInWishlist(product._id) ? 'Remove from Wishlist' : 'Save to Wishlist'}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-center ${
                    isInWishlist(product._id)
                      ? 'border-blush-dark bg-blush text-rose-dark shadow-xs'
                      : 'border-cream bg-white text-cocoa hover:border-blush-dark hover:bg-blush-light'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 transition-transform ${
                      isInWishlist(product._id) ? 'fill-rose-dark scale-110' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-cream text-xs text-taupe font-light">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-dark" />
                <span>Non-comedogenic & gentle</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-dark" />
                <span>Zero synthetic fragrance</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-dark" />
                <span>Complimentary luxury packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-rose-dark" />
                <span>Standard dispatch within 24h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion / Tabs: Benefits, Ingredients, Usage */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-cream shadow-xs mb-24">
        <div className="flex border-b border-cream gap-8 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('benefits')}
            className={`pb-4 text-xs uppercase tracking-luxury font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'benefits'
                ? 'border-cocoa text-cocoa'
                : 'border-transparent text-taupe hover:text-cocoa'
            }`}
          >
            The Ritual & Benefits
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-4 text-xs uppercase tracking-luxury font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'ingredients'
                ? 'border-cocoa text-cocoa'
                : 'border-transparent text-taupe hover:text-cocoa'
            }`}
          >
            Full Ingredients
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`pb-4 text-xs uppercase tracking-luxury font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'usage'
                ? 'border-cocoa text-cocoa'
                : 'border-transparent text-taupe hover:text-cocoa'
            }`}
          >
            How to Use
          </button>
        </div>

        {activeTab === 'benefits' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="font-serif text-2xl text-cocoa">Formulated with intention</h3>
            <p className="text-sm text-taupe leading-relaxed font-light">
              {product.skinType}
            </p>
            {product.keyBenefits && product.keyBenefits.length > 0 && (
              <ul className="space-y-2 pt-2">
                {product.keyBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs text-cocoa font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-dark" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="space-y-4 max-w-3xl">
            <h3 className="font-serif text-2xl text-cocoa">Clean, conscious formulation</h3>
            <p className="text-xs text-taupe leading-relaxed font-mono bg-ivory p-5 rounded-2xl border border-cream">
              {product.ingredients || 'Water/Aqua, Glycerin, Niacinamide, Sodium Hyaluronate, Panthenol, Camellia Sinensis Leaf Extract.'}
            </p>
            <p className="text-[11px] text-taupe font-light">
              Rossele Skin formulations are formulated with cosmetic-grade botanical actives. Free from artificial dyes, parabens, and sulfates.
            </p>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="font-serif text-2xl text-cocoa">The Application Ritual</h3>
            <p className="text-sm text-taupe leading-relaxed font-light">
              {product.directions || 'Apply 2-3 drops or pumps onto freshly cleansed skin morning and evening. Gently press into face and neck.'}
            </p>
            <div className="p-4 rounded-2xl bg-blush-light border border-blush text-xs text-cocoa flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-rose-dark flex-shrink-0" />
              <span>Pro Ritual Tip: Apply onto slightly damp skin after cleansing to lock in maximum hydration.</span>
            </div>
          </div>
        )}
      </section>

      {/* Customer Reviews & Live Submission */}
      <section className="mb-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block mb-1">
              Ritual Feedback
            </span>
            <h2 className="font-serif text-3xl text-cocoa font-normal">
              Customer Reviews ({reviews.length})
            </h2>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="btn-outline rounded-xl flex items-center gap-2 text-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-6 rounded-3xl bg-white border border-cream shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-rose-dark">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-rose-dark' : 'text-cream'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-taupe font-light">
                    {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {rev.title && (
                  <h4 className="font-serif text-lg text-cocoa font-medium">
                    {rev.title}
                  </h4>
                )}

                <p className="text-xs text-taupe leading-relaxed font-light">
                  "{rev.comment}"
                </p>

                <div className="pt-3 border-t border-cream flex items-center justify-between text-xs">
                  <span className="font-medium text-cocoa">{rev.customerName}</span>
                  {rev.verifiedPurchase && (
                    <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-medium">
                      ✓ Verified Ritual
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-cream text-taupe">
            <p className="text-sm mb-4">No reviews yet for this product. Be the first to share your ritual experience!</p>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="btn-secondary rounded-xl text-xs"
            >
              Write First Review
            </button>
          </div>
        )}
      </section>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-cocoa/50 backdrop-blur-xs" onClick={() => setIsReviewModalOpen(false)} />
          <div className="relative min-h-screen px-4 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-cream shadow-float relative z-10">
              <h3 className="font-serif text-2xl text-cocoa mb-2">Share Your Ritual</h3>
              <p className="text-xs text-taupe mb-6 font-light">
                Your feedback is saved directly to the database and displayed for other skincare lovers.
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-taupe block mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-rose-dark"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating ? 'fill-rose-dark' : 'text-cream'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-taupe block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Elena Vance"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-taupe block mb-1">Review Headline</label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. In love with the velvety finish"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-taupe block mb-1">Your Review</label>
                  <textarea
                    required
                    rows="4"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe how the formulation felt on your skin..."
                    className="w-full px-4 py-2.5 rounded-xl border border-cream text-xs text-cocoa bg-ivory/50 focus:border-rose outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="btn-outline rounded-xl flex-1 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn-primary rounded-xl flex-1 text-xs"
                  >
                    {submittingReview ? 'Posting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="mb-8">
            <span className="text-xs uppercase tracking-luxury text-rose-dark font-medium block mb-1">
              Complete The Routine
            </span>
            <h2 className="font-serif text-3xl text-cocoa font-normal">
              Pairs Beautifully With
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
