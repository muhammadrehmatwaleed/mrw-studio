const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Admin user cannot be deleted');
  }

  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

module.exports = { getUsers, deleteUser };
