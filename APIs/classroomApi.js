const express = require("express");
const Classroom = require("../models/Classroom");
const classroomApi = express.Router();

classroomApi.post("/", async (req, res) => {
  try {
    const classrooms = req.body;

    // Validate request body
    if (!Array.isArray(classrooms) || classrooms.length === 0) {
      return res.status(400).json({ message: "Invalid input, provide an array of classrooms" });
    }

    // Ensure every classroom has name and maxCapacity
    for (let cls of classrooms) {
      if (!cls.name || !cls.maxCapacity) {
        return res.status(400).json({ message: "Name and maxCapacity are required" });
      }
    }

    // Insert classrooms into DB
    const insertedClassrooms = await Classroom.insertMany(classrooms);
    res.status(201).json({ message: "Classrooms added successfully", insertedClassrooms });

  } catch (error) {
    res.status(500).json({ message: "Error adding classrooms", error });
  }
});

module.exports = classroomApi;
