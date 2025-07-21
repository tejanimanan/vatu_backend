const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

router.post('/', auth, postController.createPost);
router.get('/', postController.getAllPosts);

// Comments
router.post('/:id/comments', auth, postController.addComment);
router.get('/:id/comments', postController.getComments);

// Likes
router.post('/:id/like', auth, postController.likePost);
router.post('/:id/unlike', auth, postController.unlikePost);

// Edit & Delete
router.delete('/:id', auth, postController.deletePost);
router.put('/:id', auth, postController.updatePost);

module.exports = router; 