import express from 'express';
import { getAdminStatistics, getAdminReports, updateReportStatus } from '../controllers/adminController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { updateReportStatusSchema } from '../validators/reportValidator.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Apply auth and admin middleware to all admin routes
router.use(protect, adminOnly);

router.get('/statistics', getAdminStatistics);
router.get('/reports', getAdminReports);
router.patch('/reports/:id', validate(updateReportStatusSchema), updateReportStatus);

export default router;
