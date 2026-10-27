import Product from '../models/Product.js';
import Review from '../models/Review.js';

// @desc    Get all products with filtering, search & sorting
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, featured, minPrice, maxPrice, limit = 50, page = 1 } = req.query;

    const query = {};

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search keyword in name, shortDescription, description
    if (search && search.trim() !== '') {
      const keywordRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: keywordRegex },
        { shortDescription: keywordRegex },
        { description: keywordRegex }
      ];
    }

    // Build sort options
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'name-asc') {
      sortOptions = { name: 1 };
    } else if (sort === 'name-desc') {
      sortOptions = { name: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by id or slug
// @route   GET /api/products/:idOrSlug
// @access  Public
export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    let product;
    // Check if valid ObjectId
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug);
    } else {
      product = await Product.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Also fetch reviews for this product
    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      product,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      tagline,
      shortDescription,
      description,
      price,
      originalPrice,
      category,
      volume,
      images,
      ingredients,
      keyBenefits,
      directions,
      skinType,
      stockQuantity,
      isFeatured
    } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, category'
      });
    }

    // Default fallback images if not provided
    const productImages = images && images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1608248597359-2e698888b506?auto=format&fit=crop&w=800&q=80'
    ];

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Check slug collision
    const existingSlug = await Product.findOne({ slug });
    const finalSlug = existingSlug ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const product = await Product.create({
      name: name.trim(),
      slug: finalSlug,
      tagline: tagline || '',
      shortDescription: shortDescription || description.slice(0, 100),
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      category,
      volume: volume || '50 ml / 1.7 fl. oz.',
      images: productImages,
      ingredients: ingredients || 'Water/Aqua, Glycerin, Niacinamide, Sodium Hyaluronate, Panthenol, Camellia Sinensis Leaf Extract.',
      keyBenefits: keyBenefits || ['Deeply hydrates', 'Supports skin barrier', 'Dewy finish'],
      directions: directions || 'Gently massage 2-3 pumps onto cleansed face and neck morning and night.',
      skinType: skinType || 'Suitable for all skin types, including sensitive skin.',
      stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 25,
      isFeatured: Boolean(isFeatured)
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update fields
    const updates = { ...req.body };
    if (updates.name && updates.name !== product.name) {
      updates.slug = updates.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(id);
    // Also remove associated reviews
    await Review.deleteMany({ product: id });

    res.status(200).json({
      success: true,
      message: 'Product and associated reviews deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
