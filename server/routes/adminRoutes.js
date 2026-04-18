const express = require('express');
const { getDashboardStats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', protect, adminOnly, getDashboardStats);

module.exports = router;
