const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const auth = require('../middleware/auth');

router.post('/', auth, conversationController.createConversation);
router.get('/', auth, conversationController.getAllConversations);
router.post('/:id/messages', auth, conversationController.addMessage);
router.get('/unread-count', auth, conversationController.getUnreadCount);
router.post('/mark-all-read', auth, conversationController.markAllAsRead);

module.exports = router; 