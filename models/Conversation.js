const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  time: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { _id: false });

const ConversationSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [MessageSchema],
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema); 