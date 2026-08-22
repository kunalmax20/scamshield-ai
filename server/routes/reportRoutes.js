import express from 'express';
import { createReport, getMyReports } from '../controllers/reportController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { reportSchema } from '../validators/reportValidator.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, validate(reportSchema), createReport);
router.get('/my', protect, getMyReports);

export default router;
