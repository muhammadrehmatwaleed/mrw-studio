const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, adminOnly, upload.single('image'), uploadImage);

module.exports = router;
