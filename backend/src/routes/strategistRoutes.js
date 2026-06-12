const express = require('express');
const router = express.Router();
const strategistController = require('../controllers/strategistController');

router.post('/analyze', strategistController.analyzeBusiness);

module.exports = router;
