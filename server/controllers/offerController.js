const asyncHandler = require('express-async-handler');
const Offer = require('../models/Offer');

const getOffers = asyncHandler(async (req, res) => {
  const offers = await Offer.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
  res.json(offers);
});

const getAdminOffers = asyncHandler(async (req, res) => {
  const offers = await Offer.find({}).sort({ order: 1, createdAt: -1 });
  res.json(offers);
});

const createOffer = asyncHandler(async (req, res) => {
  const { title, subtitle, highlight, isActive = true, order = 0 } = req.body;

  if (!title || !subtitle || !highlight) {
    res.status(400);
    throw new Error('Title, subtitle, and highlight are required');
  }

  const offer = await Offer.create({
    title,
    subtitle,
    highlight,
    isActive,
    order,
  });

  res.status(201).json(offer);
});

const updateOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);

  if (!offer) {
    res.status(404);
    throw new Error('Offer not found');
  }

  offer.title = req.body.title ?? offer.title;
  offer.subtitle = req.body.subtitle ?? offer.subtitle;
  offer.highlight = req.body.highlight ?? offer.highlight;
  offer.isActive = typeof req.body.isActive === 'boolean' ? req.body.isActive : offer.isActive;
  offer.order = req.body.order ?? offer.order;

  const updated = await offer.save();
  res.json(updated);
});

const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);

  if (!offer) {
    res.status(404);
    throw new Error('Offer not found');
  }

  await offer.deleteOne();
  res.json({ message: 'Offer removed' });
});

module.exports = {
  getOffers,
  getAdminOffers,
  createOffer,
  updateOffer,
  deleteOffer,
};