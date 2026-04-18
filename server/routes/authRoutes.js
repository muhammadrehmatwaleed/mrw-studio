const express = require('express');
const {
  registerUser,
  loginUser,
  forgotPassword,
  getProfile,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);

module.exports = router;
