const express = require('express');
const { registerUser, loginUser, checkDriverStatusByName } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/driver-status', authMiddleware, checkDriverStatusByName);

module.exports = router;
