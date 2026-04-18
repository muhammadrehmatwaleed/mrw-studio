const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 12;
  const keyword = req.query.search
    ? { name: { $regex: req.query.search, $options: 'i' } }
    : {};
  const category = req.query.category ? { category: req.query.category } : {};

  let sort = { createdAt: -1 };
  if (req.query.sort === 'priceAsc') sort = { price: 1 };
  if (req.query.sort === 'priceDesc') sort = { price: -1 };
  if (req.query.sort === 'popularity') sort = { soldCount: -1, rating: -1 };

  const filter = { ...keyword, ...category };
  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name')
    .sort(sort)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({ products, page, pages: Math.ceil(count / pageSize), count });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    stock: req.body.stock,
    images: req.body.images || [],
    isFeatured: req.body.isFeatured || false,
  });

  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.name = req.body.name ?? product.name;
  product.description = req.body.description ?? product.description;
  product.category = req.body.category ?? product.category;
  product.price = req.body.price ?? product.price;
  product.stock = req.body.stock ?? product.stock;
  product.images = req.body.images ?? product.images;
  product.isFeatured = req.body.isFeatured ?? product.isFeatured;

  const updated = await product.save();
  res.json(updated);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed by this user');
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(8).populate('category', 'name');
  res.json(products);
});

const getTrendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ soldCount: -1, rating: -1 }).limit(8).populate('category', 'name');
  res.json(products);
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getFeaturedProducts,
  getTrendingProducts,
};
