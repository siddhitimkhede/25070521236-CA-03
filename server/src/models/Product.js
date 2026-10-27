import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    tagline: {
      type: String,
      default: ''
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide a short description'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a full description']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price in INR'],
      min: [0, 'Price must be positive']
    },
    originalPrice: {
      type: Number,
      default: null
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'Cleansers',
        'Serums',
        'Moisturizers',
        'Lip Care',
        'Toners & Mists',
        'Eye & Targeted',
        'Sun Care',
        'Masks & Treatments'
      ]
    },
    volume: {
      type: String,
      default: '50 ml / 1.7 fl. oz.'
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one product image'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'A product must have at least one image'
      }
    },
    ingredients: {
      type: String,
      default: ''
    },
    keyBenefits: {
      type: [String],
      default: []
    },
    directions: {
      type: String,
      default: ''
    },
    skinType: {
      type: String,
      default: 'All skin types, including sensitive skin'
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 25
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Slugify helper if not present
productSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
