const express = require("express");
const scheduleApi = express.Router();
const Schedule = require("../models/scheduleModel");

// ✅ Insert Schedules
scheduleApi.post("/", async (req, res) => {
  try {
    const schedules = await Schedule.insertMany(req.body);
    res.status(201).json({ message: "Schedules added!", schedules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Schedules for a Specific Faculty using empID
scheduleApi.get("/emp/:empID", async (req, res) => {
  try {
    const schedules = await Schedule.find({ empID: req.params.empID });
    if (!schedules.length) return res.status(404).json({ message: "No schedules found" });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Find Free Faculties for a Given Day & Period
scheduleApi.get("/free", async (req, res) => {
  try {
    const { day, period } = req.query;
    if (!day || !period) {
      return res.status(400).json({ message: "Day and period are required" });
    }

    // Convert period to a number
    const periodNum = Number(period);

    // Find free faculties based on the given day & period
    const freeFaculties = await Schedule.find({
      schedule: { $elemMatch: { day, freePeriods: periodNum } }
    }).populate("facultyId", "name department email");

    if (!freeFaculties.length) {
      return res.status(404).json({ message: "No free faculties found" });
    }

    // Extract only faculty details
    const facultyDetails = freeFaculties.map(faculty => ({
      name: faculty.facultyId.name,
      department: faculty.facultyId.department,
      email: faculty.facultyId.email
    }));

    res.status(200).json(facultyDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get All Schedules
scheduleApi.get("/", async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("facultyId", "name department email");
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = scheduleApi;
