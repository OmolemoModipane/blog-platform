const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('./db'); // Your database setup

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a secure key

// Register new user
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    res.status(201).send('User created');
  } catch (error) {
    res.status(500).send('Error creating user');
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (user && await bcrypt.compare(password, user.password)) { 
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Get current user
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.userId]);
    res.json({ user });
  } catch (error) {
    res.status(500).send('Error fetching user info');
  }
});

// Logout user (invalidate token on client side)
router.post('/logout', (req, res) => {
  res.send('Logged out');
});

module.exports = router;
