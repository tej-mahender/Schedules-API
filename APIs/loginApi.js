const express = require('express');
const router = express.Router();
const Login = require('../models/login'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

// User registration (store empid and hashed password)
router.post('/register', async (req, res) => {
    const { empid, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await Login.findOne({ empid });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Login({ empid, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// User login (verify empid and password)
router.post('/login', async (req, res) => {
    const { empid, password } = req.body;

    try {
        const user = await Login.findOne({ empid });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ empid: user.empid }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
