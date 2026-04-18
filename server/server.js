const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const { configureCloudinary } = require('./config/cloudinary');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const offerRoutes = require('./routes/offerRoutes');

dotenv.config({ path: path.join(__dirname, '.env') });
connectDB();
configureCloudinary();

const app = express();

const allowedOrigins = new Set();
if (process.env.CLIENT_URL) {
  allowedOrigins.add(process.env.CLIENT_URL.trim());
}

if (process.env.CLIENT_URLS) {
  process.env.CLIENT_URLS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .forEach((origin) => allowedOrigins.add(origin));
}

const allowDeployPreviews = process.env.ALLOW_DEPLOY_PREVIEWS === 'true';
const isPreviewDomain = (origin) =>
  /^https:\/\/[a-z0-9-]+(?:-[a-z0-9-]+)*\.(vercel\.app|netlify\.app)$/i.test(origin);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    const isLocalDevOrigin = /^http:\/\/localhost:\d+$/.test(origin);

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV !== 'production' && isLocalDevOrigin) {
      return callback(null, true);
    }

    if (allowDeployPreviews && isPreviewDomain(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS blocked for this origin'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/offers', offerRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
