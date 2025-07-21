const mongoose = require('mongoose');

const ReelSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  video: { type: String, required: true },
  caption: { type: String },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Reel', ReelSchema); 