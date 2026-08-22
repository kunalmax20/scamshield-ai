import express from 'express';
import { scanText, scanImage, scanUrl, getScanHistory, getScanById } from '../controllers/scanController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { textScanSchema, urlScanSchema } from '../validators/scanValidator.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { upload, verifyImageMagicBytes } from '../middleware/uploadMiddleware.js';
import { scanLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/text', scanLimiter, optionalAuth, validate(textScanSchema), scanText);
router.post('/image', scanLimiter, optionalAuth, upload.single('screenshot'), verifyImageMagicBytes, scanImage);
router.post('/url', scanLimiter, optionalAuth, validate(urlScanSchema), scanUrl);

router.get('/history', protect, getScanHistory);
router.get('/:id', optionalAuth, getScanById);

export default router;
