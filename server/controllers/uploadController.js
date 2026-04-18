const asyncHandler = require('express-async-handler');
const { cloudinary } = require('../config/cloudinary');

const uploadBufferToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'mern-ecommerce',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );

    stream.end(buffer);
  });

const uploadImage = asyncHandler(async (req, res) => {
  if (req.file?.buffer && process.env.CLOUDINARY_CLOUD_NAME) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer);
    return res.status(201).json({ url: uploaded.secure_url });
  }

  if (req.body.imageUrl) {
    return res.status(201).json({ url: req.body.imageUrl });
  }

  if (req.body.base64 && process.env.CLOUDINARY_CLOUD_NAME) {
    const uploaded = await cloudinary.uploader.upload(req.body.base64, {
      folder: 'mern-ecommerce',
    });
    return res.status(201).json({ url: uploaded.secure_url });
  }

  res.status(400);
  throw new Error('No image provided. Send multipart file, imageUrl, or base64 payload.');
});

module.exports = { uploadImage };
