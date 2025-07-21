const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Register
router.post('/register', userController.register);
// Login
router.post('/login', userController.login);
// Get current user
router.get('/me', auth, userController.getMe);
// Update current user
router.put('/me', auth, userController.updateMe);
// List all users
router.get('/', userController.getAllUsers);

module.exports = router; 