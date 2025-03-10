const express = require("express");
const Subject = require("../models/Subject");
const subjectApi = express.Router();

// ✅ Add subjects (POST)
subjectApi.post("/", async (req, res) => {
    try {
        const subjects = req.body; // Expecting an array of subjects

        if (!Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({ message: "Invalid subjects array" });
        }

        const missingFields = subjects.filter(sub => !sub.subjectCode || !sub.name);
        if (missingFields.length > 0) {
            return res.status(400).json({ message: "Each subject must have subjectCode and name" });
        }

        const insertedSubjects = await Subject.insertMany(subjects);
        res.status(201).json({ message: "Subjects added successfully", insertedSubjects });
    } catch (error) {
        res.status(500).json({ message: "Error adding subjects", error });
    }
});

// ✅ Get all subjects (GET)
subjectApi.get("/", async (req, res) => {
    try {
        const subjects = await Subject.find(); // Fetch all subjects from DB
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subjects", error });
    }
});

module.exports = subjectApi;
