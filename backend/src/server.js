import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import reportRoutes from './routes/reports.js';
import statsRoutes from './routes/stats.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lab_management';
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.get('/', (_req, res) => {
  res.json({ status: 'ok', name: 'lab-management-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/stats', statsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


