import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Helper to generate elegant order receipts: RSL-2026-XXXXX
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `RSL-${timestamp}-${random}`;
};

// @desc    Create a new order (Server-side price & stock verification)
// @route   POST /api/orders
// @access  Public (Guest or Authenticated)
export const createOrder = async (req, res, next) => {
  try {
    const {
      customerInfo,
      shippingAddress,
      orderItems,
      paymentMethod = 'demo_card',
      notes
    } = req.body;

    // Validate customer and shipping info
    const customer = {
      name: customerInfo?.name || req.user?.name || '',
      email: customerInfo?.email || req.user?.email || '',
      phone: customerInfo?.phone || ''
    };

    if (!customer.name || !customer.email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid customer name and email'
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required shipping address fields'
      });
    }

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your shopping bag is empty'
      });
    }

    // Step 2 & 3: Retrieve real product prices and check stock from MongoDB
    const verifiedItems = [];
    let calculatedSubtotal = 0;

    for (const item of orderItems) {
      const productId = item.productId || item._id || item.product;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${productId} was not found in our catalogue`
        });
      }

      const requestedQty = Math.max(1, parseInt(item.quantity, 10) || 1);

      if (product.stockQuantity < requestedQty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${requestedQty}`
        });
      }

      const itemTotal = product.price * requestedQty;
      calculatedSubtotal += itemTotal;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: product.price, // Server price used, NOT client price
        quantity: requestedQty
      });
    }

    // Step 4: Calculate shipping and total on the server
    // Free shipping on orders over ₹1,500, otherwise ₹150 flat shipping
    const shippingCharge = calculatedSubtotal >= 1500 ? 0 : 150;
    const finalTotal = calculatedSubtotal + shippingCharge;

    // Step 5: Create order in MongoDB
    const orderNumber = generateOrderNumber();
    const trackingNumber = `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const order = await Order.create({
      orderNumber,
      user: req.user ? req.user._id : null,
      customerInfo: {
        name: customer.name.trim(),
        email: customer.email.toLowerCase().trim(),
        phone: customer.phone ? customer.phone.trim() : ''
      },
      shippingAddress: {
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        country: shippingAddress.country || 'India'
      },
      orderItems: verifiedItems,
      subtotal: calculatedSubtotal,
      shippingCharge,
      total: finalTotal,
      orderStatus: 'Confirmed',
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'Cash on Delivery (Demo)' : 'Completed (Demo)',
      trackingNumber,
      notes: notes || ''
    });

    // Step 6: Decrement stock consistently in MongoDB
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: -item.quantity }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully. Thank you for choosing ROSSELE SKIN.',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID or Order Number
// @route   GET /api/orders/:idOrOrderNumber
// @access  Public (with receipt number) / Private
export const getOrderById = async (req, res, next) => {
  try {
    const { idOrOrderNumber } = req.params;

    let order;
    if (idOrOrderNumber.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(idOrOrderNumber).populate('orderItems.product', 'slug name category');
    } else {
      order = await Order.findOne({ orderNumber: idOrOrderNumber }).populate('orderItems.product', 'slug name category');
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order receipt not found'
      });
    }

    // If order has a registered user and requester is logged in, check permission unless admin
    if (order.user && req.user && req.user.role !== 'admin') {
      if (order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this customer order'
        });
      }
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders for logged in user
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [
        { user: req.user._id },
        { 'customerInfo.email': req.user.email.toLowerCase() }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    const query = {};
    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to "${order.orderStatus}"`,
      order
    });
  } catch (error) {
    next(error);
  }
};
