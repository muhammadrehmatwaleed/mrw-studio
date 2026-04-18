const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Offer = require('./models/Offer');

dotenv.config({ path: path.join(__dirname, '.env') });

const seed = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany(), Offer.deleteMany()]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin',
  });

  const user = await User.create({
    name: 'Demo User',
    email: 'user@example.com',
    password: 'User123!',
    role: 'user',
  });

  const categories = await Category.insertMany([
    { name: 'Fashion' },
    { name: 'Electronics' },
    { name: 'Accessories' },
    { name: 'Home' },
  ]);

  const products = [
    {
      name: 'Minimal Chrono Watch',
      description: 'Elegant stainless steel watch with sapphire glass and premium strap.',
      category: categories[2]._id,
      price: 129,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200'],
      isFeatured: true,
      soldCount: 40,
      rating: 4.7,
      numReviews: 14,
    },
    {
      name: 'Nordic Lounge Chair',
      description: 'Soft boucle fabric and curved armrest for a modern interior setup.',
      category: categories[3]._id,
      price: 299,
      stock: 12,
      images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200'],
      isFeatured: true,
      soldCount: 21,
      rating: 4.5,
      numReviews: 11,
    },
    {
      name: 'Aero Wireless Headphones',
      description: 'Noise isolation, 40h battery life, and crisp balanced audio profile.',
      category: categories[1]._id,
      price: 179,
      stock: 45,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200'],
      isFeatured: false,
      soldCount: 76,
      rating: 4.8,
      numReviews: 33,
    },
    {
      name: 'Urban Layer Jacket',
      description: 'Water-resistant shell jacket with lightweight insulated lining.',
      category: categories[0]._id,
      price: 159,
      stock: 25,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200'],
      isFeatured: true,
      soldCount: 59,
      rating: 4.6,
      numReviews: 24,
    },
    {
      name: 'Stoneware Coffee Set',
      description: 'Hand-finished ceramic set for modern kitchen and dining spaces.',
      category: categories[3]._id,
      price: 89,
      stock: 40,
      images: ['https://images.unsplash.com/photo-1517705008128-361805f42e86?w=1200'],
      isFeatured: false,
      soldCount: 28,
      rating: 4.4,
      numReviews: 9,
    },
  ];

  await Product.insertMany(products);

  await Offer.insertMany([
    {
      title: 'Weekend Flash Deal',
      subtitle: 'Up to 40% off on home essentials and decor picks.',
      highlight: 'Use code: WEEKEND40',
      isActive: true,
      order: 1,
    },
    {
      title: 'Bundle & Save',
      subtitle: 'Buy any 2 fashion items and get an extra 15% discount.',
      highlight: 'Auto-applied at checkout',
      isActive: true,
      order: 2,
    },
    {
      title: 'Free Delivery',
      subtitle: 'Enjoy free shipping on orders above $75 for a limited time.',
      highlight: 'No code required',
      isActive: true,
      order: 3,
    },
  ]);

  console.log('Seed complete');
  console.log('Admin: admin@example.com / Admin123!');
  console.log('User: user@example.com / User123!');
  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
