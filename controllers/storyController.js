const Story = require('../models/Story');

exports.createStory = async (req, res) => {
  try {
    const { image, caption, isOwn } = req.body;
    const story = await Story.create({ user: req.user.id, image, caption, isOwn });
    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().populate('user', 'username avatar').populate('comments.user', 'username avatar').sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    const comment = { user: req.user.id, text };
    story.comments.push(comment);
    await story.save();
    await story.populate('comments.user', 'username avatar');
    res.status(201).json(story.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id).populate('comments.user', 'username avatar');
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json(story.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.likeStory = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    if (!story.likes.includes(req.user.id)) {
      story.likes.push(req.user.id);
      await story.save();
    }
    res.json({ likes: story.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unlikeStory = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    story.likes = story.likes.filter(uid => uid.toString() !== req.user.id);
    await story.save();
    res.json({ likes: story.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 