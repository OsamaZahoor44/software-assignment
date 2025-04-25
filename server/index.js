// index.js
const express = require('express');
const { connectToDatabase } = require('./db');
require('dotenv').config();

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to database
connectToDatabase();

// Define your routes (example)
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Example API route
app.get('/users', async (req, res) => {
  try {
    const result = await sql.query('SELECT * FROM Users');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send('Database query failed');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
