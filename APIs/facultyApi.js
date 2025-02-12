const express = require("express");
const facultyApi = express.Router();
const Faculty = require("../models/facultyModel");

// ✅ Insert Faculties
facultyApi.post("/", async (req, res) => {
  try {
    const faculties = await Faculty.insertMany(req.body);
    res.status(201).json({ message: "Faculties added!", faculties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get All Faculties
facultyApi.get("/", async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.status(200).json(faculties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Faculty by ID
facultyApi.get("/:id", async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = facultyApi;
