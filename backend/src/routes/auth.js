import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const user = await User.create({ name, email, password, role: 'Admin' });
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const payload = { id: user.id, role: user.role, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: payload });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;


