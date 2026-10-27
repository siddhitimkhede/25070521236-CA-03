import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

// @desc    Get live admin dashboard analytics directly from MongoDB
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Total products count
    const totalProducts = await Product.countDocuments();

    // 2. Total orders count
    const totalOrders = await Order.countDocuments();

    // 3. Total registered users (excluding admins if desired, or all users with role 'user')
    const totalUsers = await User.countDocuments({ role: 'user' });

    // 4. Total recorded order value (revenue) calculated via MongoDB aggregation
    const revenueAggregation = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // 5. Low-stock products (stock <= 10)
    const lowStockProducts = await Product.find({ stockQuantity: { $lte: 10 } })
      .select('name category price stockQuantity images')
      .sort({ stockQuantity: 1 });

    // 6. Recent 8 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select('orderNumber customerInfo total orderStatus paymentStatus createdAt');

    // 7. Orders count grouped by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    // 8. Category distribution
    const categoryDistribution = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        recentOrders,
        ordersByStatus,
        categoryDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users/customers
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Attach order count for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const orderCount = await Order.countDocuments({
          $or: [{ user: u._id }, { 'customerInfo.email': u.email }]
        });
        return {
          ...u.toObject(),
          orderCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats
    });
  } catch (error) {
    next(error);
  }
};
