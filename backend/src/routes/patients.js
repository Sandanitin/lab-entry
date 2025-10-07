import express from 'express';
import Patient from '../models/Patient.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.post('/', async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get('/', async (_req, res) => {
  const patients = await Patient.find().sort({ createdAt: -1 });
  res.json(patients);
});

router.get('/:id', async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ message: 'Not found' });
  res.json(patient);
});

router.put('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ message: 'Not found' });
    res.json(patient);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;


