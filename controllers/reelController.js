const Reel = require('../models/Reel');

exports.createReel = async (req, res) => {
  try {
    const { video, caption } = req.body;
    const reel = await Reel.create({ user: req.user.id, video, caption });
    res.status(201).json(reel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find().populate('user', 'username avatar');
    res.json(reels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 