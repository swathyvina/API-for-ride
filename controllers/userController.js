const pool = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register User
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!['rider', 'driver'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, password, role]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error registering user' });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND password = $2',
            [email, password]
        );
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in' });
    }
} 

//driverstatus
const checkDriverStatusByName = async (req, res) => {
    const { name } = req.body; 

    try {
      
        const result = await pool.query(
            'SELECT id, name, email, status FROM drivers WHERE name = $1',
            [name]
        );

       
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const driver = result.rows[0];

       
        res.status(200).json({
            driverId: driver.id,
            name: driver.name,
            email: driver.email,
            onlineStatus: driver.status  
        });
    } catch (err) {
        console.error('Error checking driver status:', err);
        res.status(500).json({ message: 'Error checking driver status' });
    }
};
module.exports = { registerUser, loginUser, checkDriverStatusByName };
