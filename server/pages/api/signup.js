import { sql, connect } from '../utils/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      await connect();

      const checkUser = await sql.query`
        SELECT * FROM Users WHERE email = ${email}
      `;

      if (checkUser.recordset.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await sql.query`
        INSERT INTO Users (username, email, password)
        VALUES (${username}, ${email}, ${hashedPassword})
      `;

      return res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
