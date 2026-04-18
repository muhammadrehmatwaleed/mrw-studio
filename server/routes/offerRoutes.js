const express = require('express');
const {
  getOffers,
  getAdminOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} = require('../controllers/offerController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getOffers);
router.get('/admin', protect, adminOnly, getAdminOffers);
router.post('/', protect, adminOnly, createOffer);
router.put('/:id', protect, adminOnly, updateOffer);
router.delete('/:id', protect, adminOnly, deleteOffer);

module.exports = router;