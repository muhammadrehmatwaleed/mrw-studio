const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalAmount, paymentResult } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || product.stock < item.qty) {
      res.status(400);
      throw new Error(`Insufficient stock for ${item.name}`);
    }
    product.stock -= item.qty;
    product.soldCount += item.qty;
    await product.save();
  }

  const order = await Order.create({
    userId: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    totalAmount,
    isPaid:
      paymentMethod === 'card'
        ? paymentResult?.status === 'succeeded'
        : true,
    paidAt:
      paymentMethod === 'card'
        ? paymentResult?.status === 'succeeded'
          ? new Date()
          : null
        : new Date(),
    paymentResult:
      paymentResult || {
        id: `mock_${Date.now()}`,
        status: 'succeeded',
        updateTime: new Date().toISOString(),
        emailAddress: req.user.email,
      },
  });

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('userId', 'name email')
    .populate('items.product', 'name images');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json(order);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = req.body.status || order.status;
  const updated = await order.save();
  res.json(updated);
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
