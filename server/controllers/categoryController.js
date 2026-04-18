const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 });
  res.json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const exists = await Category.findOne({ name });
  if (exists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({ name });
  res.status(201).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  category.name = req.body.name || category.name;
  const updated = await category.save();
  res.json(updated);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  await category.deleteOne();
  res.json({ message: 'Category removed' });
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
