const asyncHandler = require('express-async-handler');

const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Name, email, and message are required');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  if (!isValidEmail) {
    res.status(400);
    throw new Error('Please provide a valid email address');
  }

  const payload = {
    receivedAt: new Date().toISOString(),
    name: String(name).trim(),
    email: normalizedEmail,
    message: String(message).trim(),
  };

  // Placeholder for future integrations (email provider, CRM, support desk).
  console.log('CONTACT_MESSAGE_RECEIVED', payload);

  res.status(201).json({ message: 'Message received. Our team will contact you soon.' });
});

module.exports = {
  submitContactMessage,
};