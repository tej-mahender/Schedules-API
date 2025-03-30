const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Faculty = require("../models/facultyModel");
require('dotenv').config()

const router = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET; 

// Login route
router.post("/login", async (req, res) => {
    const { empID, password } = req.body;

    try {
        const faculty = await Faculty.findOne({ empID });

        if (!faculty || (faculty.role !== "hod" && faculty.role !== "admin")) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const isMatch = await faculty.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { empID: faculty.empID, role: faculty.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, role: faculty.role, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get logged-in user data
router.get("/me", async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Unauthorized" });
  
      const decoded = jwt.verify(token, JWT_SECRET);
      const faculty = await Faculty.findOne({ empID: decoded.empID }).select("-password");
  
      if (!faculty) return res.status(404).json({ message: "User not found" });
  
      res.json(faculty);
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  });

  
// Update Password (After First Login)
router.put("/update-password", async (req, res) => {
    const { empID, newPassword } = req.body;

    try {
        const faculty = await Faculty.findOne({ empID });

        if (!faculty) {
            return res.status(404).json({ message: "User not found" });
        }

        faculty.password = await bcrypt.hash(newPassword, 10);
        await faculty.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
