const asyncHandler = require('express-async-handler');
const Stripe = require('stripe');

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const createPaymentIntent = asyncHandler(async (req, res) => {
  const stripe = getStripeClient();
  if (!stripe) {
    res.status(400);
    throw new Error('Stripe is not configured. Add STRIPE_SECRET_KEY in server .env');
  }

  const { amount, currency = 'usd', metadata = {} } = req.body;
  if (!amount || Number(amount) <= 0) {
    res.status(400);
    throw new Error('A valid amount is required');
  }

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(Number(amount)),
    currency,
    automatic_payment_methods: { enabled: true },
    metadata,
  });

  res.status(201).json({ clientSecret: intent.client_secret, paymentIntentId: intent.id });
});

module.exports = { createPaymentIntent };
