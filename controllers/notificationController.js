const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getAllNotifications = async (req, res) => {
  try {
    const filter = { user: req.user.id };
    if (req.query.unread === 'true') filter.isRead = false;
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    // Attach actor info (from user)
    for (const n of notifications) {
      const match = n.text.match(/^(\w+) (liked|commented)/);
      if (match) {
        const actor = await User.findOne({ username: match[1] });
        n.from = actor ? { username: actor.username, avatar: actor.avatar } : null;
      }
    }
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark all notifications as read for the current user
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, isRead: false }, { $set: { isRead: true } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 