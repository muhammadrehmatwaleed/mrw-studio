const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getFeaturedProducts,
  getTrendingProducts,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);

router.route('/').get(getProducts).post(protect, adminOnly, createProduct);
router.route('/:id').get(getProductById).put(protect, adminOnly, updateProduct).delete(protect, adminOnly, deleteProduct);
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
