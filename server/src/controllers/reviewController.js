import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review for a product
// @route   POST /api/reviews/:productId
// @access  Public (Optional auth)
export const createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, customerName, title, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!rating || !comment || (!customerName && !req.user)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating, comment, and your name'
      });
    }

    const reviewName = req.user ? req.user.name : customerName.trim();

    const review = await Review.create({
      product: product._id,
      user: req.user ? req.user._id : null,
      customerName: reviewName,
      rating: Number(rating),
      title: title ? title.trim() : '',
      comment: comment.trim(),
      verifiedPurchase: true
    });

    // Recalculate product rating
    const allReviews = await Review.find({ product: product._id });
    const avgRating =
      allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;

    product.rating = parseFloat(avgRating.toFixed(1));
    product.numReviews = allReviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Thank you! Your ritual review has been shared.',
      review,
      productRating: product.rating,
      productNumReviews: product.numReviews
    });
  } catch (error) {
    next(error);
  }
};
