const Post = require('../models/Post');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.createPost = async (req, res) => {
  try {
    const { image, caption } = req.body;
    const post = await Post.create({ user: req.user.id, image, caption });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username avatar').populate('comments.user', 'username avatar').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const comment = { user: req.user.id, text };
    post.comments.push(comment);
    await post.save();
    await post.populate('comments.user', 'username avatar');
    // Notification for comment
    if (post.user.toString() !== req.user.id) {
      const actor = await User.findById(req.user.id);
      await Notification.create({
        user: post.user,
        type: 'comment',
        text: `${actor.username} commented on your post`,
        time: new Date().toISOString(),
      });
    }
    res.status(201).json(post.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('comments.user', 'username avatar');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
      await post.save();
      // Notification for like
      if (post.user.toString() !== req.user.id) {
        const actor = await User.findById(req.user.id);
        await Notification.create({
          user: post.user,
          type: 'like',
          text: `${actor.username} liked your post`,
          time: new Date().toISOString(),
        });
      }
    }
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.likes = post.likes.filter(uid => uid.toString() !== req.user.id);
    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const { caption, image } = req.body;
    if (caption !== undefined) post.caption = caption;
    if (image !== undefined) post.image = image;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 