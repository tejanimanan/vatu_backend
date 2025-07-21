import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = 'myinsta_secret';

// In-memory users
const users = [
  { id: 1, username: 'john_doe', password: 'password', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 2, username: 'jane_smith', password: 'password', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
];

// Register
router.post('/register', (req, res) => {
  const { username, password, name } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  const newUser = { id: users.length + 1, username, password, name, avatar: '' };
  users.push(newUser);
  res.json({ message: 'Registered successfully' });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user.id, username: user.username, name: user.name, avatar: user.avatar } });
});

export default router; 