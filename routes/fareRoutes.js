const express = require('express');
const { checkFare } = require('../controllers/fareController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/check', authMiddleware, checkFare);

module.exports = router;
