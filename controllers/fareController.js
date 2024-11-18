const pool = require('../db');

// Check Fare
const checkFare = async (req, res) => {
    const { location } = req.body;
    try {
        const result = await pool.query('SELECT * FROM fares WHERE location = $1', [location]);
        res.json(result.rows[0] || { message: 'No fare details found for this location' });
    } catch (err) {
        res.status(500).json({ message: 'Error checking fare' });
    }
};

module.exports = { checkFare };
