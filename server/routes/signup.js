import express from 'express';
import bcrypt from 'bcryptjs';
import { poolPromise } from '../db/sql.js';
import { generateToken } from '../utils/jwt.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  try {
    const pool = await poolPromise;
    const existing = await pool
      .request()
      .input('email', email)
      .query('SELECT * FROM Users WHERE email = @email');

    if (existing.recordset.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool
      .request()
      .input('email', email)
      .input('password', hashedPassword)
      .query('INSERT INTO Users (email, password) VALUES (@email, @password)');

    const token = generateToken({ email });
    res.status(201).json({ message: 'Signup successful', token });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
