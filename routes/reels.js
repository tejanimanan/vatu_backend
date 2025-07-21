const express = require('express');
const router = express.Router();
const reelController = require('../controllers/reelController');
const auth = require('../middleware/auth');

router.post('/', auth, reelController.createReel);
router.get('/', reelController.getAllReels);

module.exports = router; 