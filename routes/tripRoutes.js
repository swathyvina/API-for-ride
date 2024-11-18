const express = require('express');
const { requestTrip, acceptTrip, viewTrips } = require('../controllers/tripController');
const  authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); 
router.post('/request-trip', authMiddleware, requestTrip);
router.put('/accept-trip', authMiddleware, acceptTrip);
router.get('/trips', authMiddleware, viewTrips);

module.exports = router;
