import multer from 'multer';
import { ApiResponse } from '../utils/apiResponse.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Security Validation Error: Only genuine JPEG, PNG, and WEBP screenshot images are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});

// Magic Byte Buffer Verifier
export const verifyImageMagicBytes = (req, res, next) => {
  if (!req.file) return next();

  const buffer = req.file.buffer;
  if (!buffer || buffer.length < 4) {
    return ApiResponse.error(res, 'Security Validation Error: Corrupted or invalid file header.', 400);
  }

  // Magic bytes: PNG (89 50 4E 47), JPEG (FF D8 FF), WEBP (52 49 46 46)
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isWebp = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;

  if (!isPng && !isJpeg && !isWebp) {
    return ApiResponse.error(res, 'Security Validation Error: File content magic bytes do not match a valid image format.', 400);
  }

  next();
};
