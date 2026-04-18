const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const getDashboardStats = asyncHandler(async (req, res) => {
  const [users, products, orders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);

  const totalSalesResult = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);

  const salesByMonth = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        total: { $sum: '$totalAmount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    counts: { users, products, orders },
    totalSales: totalSalesResult[0]?.total || 0,
    salesByMonth,
  });
});

module.exports = { getDashboardStats };
