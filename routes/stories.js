const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const auth = require('../middleware/auth');

router.post('/', auth, storyController.createStory);
router.get('/', storyController.getAllStories);

// Comments
router.post('/:id/comments', auth, storyController.addComment);
router.get('/:id/comments', storyController.getComments);

// Likes
router.post('/:id/like', auth, storyController.likeStory);
router.post('/:id/unlike', auth, storyController.unlikeStory);

module.exports = router; 