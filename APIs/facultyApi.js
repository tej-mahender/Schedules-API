const express = require("express");
const facultyApi = express.Router();
const Faculty = require("../models/facultyModel");
const bcrypt = require("bcrypt");

// ✅ Insert Faculties
facultyApi.post("/", async (req, res) => {
  try {
    // Hash passwords manually before inserting
    const hashedFaculties = await Promise.all(
      req.body.map(async (faculty) => ({
        ...faculty,
        password: await bcrypt.hash(faculty.password, 10)
      }))
    );

    const faculties = await Faculty.insertMany(hashedFaculties);
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

// ✅ Update Faculty Role (Assign Admin)
facultyApi.put("/:facultyId/role", async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { role } = req.body;

    // Ensure the role is valid
    const validRoles = ["faculty", "hod", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role assignment" });
    }

    // Find and update the faculty's role
    const updatedFaculty = await Faculty.findByIdAndUpdate(
      facultyId,
      { role },
      { new: true }
    );

    if (!updatedFaculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json({ message: `Role updated to ${role}`, updatedFaculty });
  } catch (error) {
    console.error("Error updating role:", error);
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
