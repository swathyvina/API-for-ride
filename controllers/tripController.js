const pool = require('../db');

// Request Trip
const requestTrip = async (req, res) => {
    const { startLocation, endLocation, fare } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO trips (rider_id, start_location, end_location, status, fare) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, startLocation, endLocation, 'requested', fare]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error requesting trip' });
    }
};

// Accept Trip
const acceptTrip = async (req, res) => {
    const { tripId } = req.body;
    try {
        const driverStatus = await pool.query(
            'SELECT online_status FROM users WHERE id = $1 AND role = $2',
            [req.user.id, 'driver']
        );
        if (!driverStatus.rows[0]?.online_status) {
            return res.status(400).json({ message: 'Driver is offline' });
        }

        await pool.query(
            'UPDATE trips SET driver_id = $1, status = $2 WHERE id = $3',
            [req.user.id, 'accepted', tripId]
        );
        res.json({ message: 'Trip accepted' });
    } catch (err) {
        res.status(500).json({ message: 'Error accepting trip' });
    }
};

// View Trips
const viewTrips = async (req, res) => {
    const column = req.user.role === 'rider' ? 'rider_id' : 'driver_id';
    try {
        const result = await pool.query(`SELECT * FROM trips WHERE ${column} = $1`, [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching trips' });
    }
};

module.exports = { requestTrip, acceptTrip, viewTrips };
