const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String },
  email: { type: String, unique: true },
  pronouns: { type: String },
  link: { type: String },
  banners: { type: String },
  gender: { type: String },
  music: { type: String },
  threadsBadge: { type: Boolean, default: true },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      if (ret.avatar && ret.avatar.startsWith('/uploads')) {
        ret.avatar = `${process.env.BACKEND_URL || 'http://localhost:5000'}${ret.avatar}`;
      }
      return ret;
    }
  }
});

module.exports = mongoose.model('User', UserSchema); 