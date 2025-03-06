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

// ✅ Get Faculty by empID
facultyApi.get("/emp/:empID", async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ empID: req.params.empID });
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update Faculty by empID
facultyApi.put("/emp/:empID", async (req, res) => {
  try {
    const updatedFaculty = await Faculty.findOneAndUpdate(
      { empID: req.params.empID },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFaculty) return res.status(404).json({ message: "Faculty not found" });
    res.status(200).json({ message: "Faculty updated successfully!", updatedFaculty });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete Faculty by empID
facultyApi.delete("/emp/:empID", async (req, res) => {
  try {
    const deletedFaculty = await Faculty.findOneAndDelete({ empID: req.params.empID });
    if (!deletedFaculty) return res.status(404).json({ message: "Faculty not found" });
    res.status(200).json({ message: "Faculty deleted successfully!", deletedFaculty });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = facultyApi;
