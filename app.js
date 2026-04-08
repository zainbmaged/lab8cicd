
const express = require('express');
const os = require('os');
const { Pool } = require('pg');
const app = express();
const PORT = 3000;

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASS     || 'secret',
  database: process.env.DB_NAME     || 'lab8',
  port:     process.env.DB_PORT     || 5432,
});
 
pool.connect((err) => {
  if (err) { console.error('DB connection error:', err.message); }
  else      { console.log('Connected to PostgreSQL'); }
});

// Route 1: basic info
app.get('/', (req, res) => {
  res.json({
    app:  'CISC 886 Lab 8',
    mode: process.env.MODE || 'local',
    node: process.version,
    host: os.hostname(),
  });
});

// Route 2: tasks grouped by status
// Object.groupBy is only available in Node.js v21+.
// On Node 18 this will throw: TypeError: Object.groupBy is not a function

app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }

});

app.listen(PORT, () => {
  console.log('--------------------------------------------------');
  console.log(`  CISC 886 Lab 8 — App started`);
  console.log(`  Port:  ${PORT}`);
  console.log(`  Mode:  ${process.env.MODE || 'local'}`);
  console.log(`  Node:  ${process.version}`);
  console.log(`  Host:    ${os.hostname()}`);
  console.log('--------------------------------------------------');
});
