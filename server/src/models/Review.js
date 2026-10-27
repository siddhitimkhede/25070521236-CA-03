import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    customerName: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5
    },
    title: {
      type: String,
      default: '',
      trim: true
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      trim: true
    },
    verifiedPurchase: {
      type: Boolean,
      default: true
    },
    isApproved: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
