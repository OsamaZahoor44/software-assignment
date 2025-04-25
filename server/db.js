// db.js (ES Module version)
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: '',
  password: '',
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const connect = async () => {
  try {
    await sql.connect(config);
    console.log('Connected to SQL Server using Windows Authentication');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
};

export { sql, connect };
