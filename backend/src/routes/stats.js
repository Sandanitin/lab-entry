import express from 'express';
import Patient from '../models/Patient.js';
import LabReport from '../models/LabReport.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/', async (_req, res) => {
  const [totalPatients, pendingReports, completedReports] = await Promise.all([
    Patient.countDocuments(),
    LabReport.countDocuments({ status: 'pending' }),
    LabReport.countDocuments({ status: 'completed' }),
  ]);

  res.json({ totalPatients, pendingReports, completedReports });
});

export default router;


