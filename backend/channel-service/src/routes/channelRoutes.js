const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');

// Define channel send triggers
router.post('/send', channelController.sendCommunication);

module.exports = router;
