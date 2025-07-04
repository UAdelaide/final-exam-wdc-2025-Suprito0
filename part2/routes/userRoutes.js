const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Received:', username, password); // for debug

  try {
    // replaced email with username
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);

    console.log('Login Credentials: ', rows); // for debug

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.user = rows[0];

    const user = rows[0];

    if (user.role === 'owner') {
      return res.json({ redirectTo: '/owner-dashboard.html' }); // redirect if owner
    }
    if (user.role === 'walker') {
      return res.json({ redirectTo: '/walker-dashboard.html' }); // redirect if walker
    }

    return res.status(403).json({ error: 'Unauthorized role' });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed' });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Logout error: ', error);
      return res.status(500).json({error: 'Logout Failed'});
    }
    // clear cookies
    res.clearCookie('connect.sid');
    // redirect to index
    return res.json({ redirectTo: '/' });
  });
});

module.exports = router;
