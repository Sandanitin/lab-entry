import express from 'express';
import PDFDocument from 'pdfkit';
import LabReport from '../models/LabReport.js';
import Patient from '../models/Patient.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.post('/', async (req, res) => {
  try {
    const report = await LabReport.create(req.body);
    res.status(201).json(report);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get('/', async (_req, res) => {
  const reports = await LabReport.find().populate('patient').sort({ createdAt: -1 });
  res.json(reports);
});

router.get('/:id', async (req, res) => {
  const report = await LabReport.findById(req.params.id).populate('patient');
  if (!report) return res.status(404).json({ message: 'Not found' });
  res.json(report);
});

router.put('/:id', async (req, res) => {
  try {
    const report = await LabReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!report) return res.status(404).json({ message: 'Not found' });
    res.json(report);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  await LabReport.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

router.get('/:id/pdf', async (req, res) => {
  const report = await LabReport.findById(req.params.id).populate('patient');
  if (!report) return res.status(404).json({ message: 'Not found' });

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  const asAttachment = req.query.download === '1' || req.query.download === 'true';
  res.setHeader('Content-Disposition', `${asAttachment ? 'attachment' : 'inline'}; filename=report-${report.id}.pdf`);
  doc.pipe(res);

  doc.fontSize(18).text('Laboratory Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Patient: ${report.patient.name}`);
  doc.text(`Age: ${report.patient.age}    Gender: ${report.patient.gender}`);
  doc.text(`Doctor: ${report.patient.doctor || '-'}`);
  doc.text(`Category: ${report.category}`);
  doc.text(`Status: ${report.status}`);
  if (report.reportedAt) doc.text(`Reported At: ${new Date(report.reportedAt).toLocaleString()}`);

  doc.moveDown();
  doc.fontSize(14).text('Tests');
  doc.moveDown(0.5);
  report.tests.forEach((t) => {
    doc.fontSize(12).text(`${t.name}: ${t.result}${t.unit ? ' ' + t.unit : ''}  (Ref: ${t.referenceRange || '-'})`);
  });

  if (report.notes) {
    doc.moveDown();
    doc.fontSize(12).text(`Notes: ${report.notes}`);
  }

  doc.end();
});

router.post('/pdf', async (req, res) => {
  // Accept a report-like payload and generate a PDF without DB lookup
  const report = req.body;
  if (!report || !report.patient) return res.status(400).json({ message: 'Invalid payload' });
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  const asAttachment = req.query.download === '1' || req.query.download === 'true';
  res.setHeader('Content-Disposition', `${asAttachment ? 'attachment' : 'inline'}; filename=report.pdf`);
  doc.pipe(res);

  doc.fontSize(18).text('Laboratory Report', { align: 'center' });
  doc.moveDown();
  const patient = report.patient || {};
  doc.fontSize(12).text(`Patient: ${patient.name || '-'}`);
  doc.text(`Age: ${patient.age || '-'}    Gender: ${patient.gender || '-'}`);
  doc.text(`Doctor: ${patient.doctor || '-'}`);
  doc.text(`Category: ${report.category || '-'}`);
  doc.text(`Status: ${report.status || '-'}`);
  if (report.reportedAt) doc.text(`Reported At: ${new Date(report.reportedAt).toLocaleString()}`);

  doc.moveDown();
  doc.fontSize(14).text('Tests');
  doc.moveDown(0.5);
  (report.tests || []).forEach((t) => {
    doc.fontSize(12).text(`${t.name}: ${t.result}${t.unit ? ' ' + t.unit : ''}  (Ref: ${t.referenceRange || '-'})`);
  });

  if (report.notes) {
    doc.moveDown();
    doc.fontSize(12).text(`Notes: ${report.notes}`);
  }

  doc.end();
});

export default router;


