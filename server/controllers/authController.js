const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id, user.role);

  res.status(201).json({
    message: 'Account created',
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id, user.role);
  res.json({
    message: 'Login successful',
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: 'If this email exists, a reset link has been sent.' });
  }

  return res.status(200).json({ message: 'Reset link sent (mock flow). Integrate mail service for production.' });
});

const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updated = await user.save();
  const token = generateToken(updated._id, updated.role);

  res.json({
    message: 'Profile updated',
    token,
    user: { id: updated._id, name: updated.name, email: updated.email, role: updated.role },
  });
});

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  getProfile,
  updateProfile,
};
