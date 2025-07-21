const Conversation = require('../models/Conversation');

exports.getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ users: req.user.id }).populate('users', 'username avatar').sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get unread message count for the current user
exports.getUnreadCount = async (req, res) => {
  try {
    let count = 0;
    const conversations = await Conversation.find({ users: req.user.id });
    conversations.forEach(conv => {
      conv.messages.forEach(msg => {
        if (!msg.isRead && String(msg.from) !== String(req.user.id)) {
          count++;
        }
      });
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark all messages as read for the current user
exports.markAllAsRead = async (req, res) => {
  try {
    const conversations = await Conversation.find({ users: req.user.id });
    for (const conv of conversations) {
      let updated = false;
      conv.messages.forEach(msg => {
        if (!msg.isRead && String(msg.from) !== String(req.user.id)) {
          msg.isRead = true;
          updated = true;
        }
      });
      if (updated) await conv.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, time } = req.body;
    const conversation = await Conversation.findById(id);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    conversation.messages.push({ from: req.user.id, text, time });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createConversation = async (req, res) => {
  const { userId, text } = req.body;
  if (!userId || !text) {
    return res.status(400).json({ error: 'User ID and message text are required' });
  }

  try {
    // Check if a conversation already exists
    let conversation = await Conversation.findOne({
      users: { $all: [req.user.id, userId] },
    });

    if (conversation) {
      // If it exists, just add the message
      conversation.messages.push({ from: req.user.id, text, time: new Date().toLocaleTimeString() });
    } else {
      // If not, create a new one
      conversation = new Conversation({
        users: [req.user.id, userId],
        messages: [{ from: req.user.id, text, time: new Date().toLocaleTimeString() }],
      });
    }

    await conversation.save();
    await conversation.populate('users', 'username avatar');
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 