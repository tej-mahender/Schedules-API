const express = require("express");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Classroom = require("../models/Classroom");
const SeatingPlan = require("../models/SeatingPlan");

const seatingPlanApi = express.Router();

// Generate Seating Plan
seatingPlanApi.post("/generate", async (req, res) => {
  try {
    const { subjects, classrooms, examDate } = req.body;

    if (!subjects || !classrooms || subjects.length === 0 || classrooms.length === 0) {
      return res.status(400).json({ message: "Subjects and classrooms are required" });
    }

    // Fetch students enrolled in selected subjects
    const students = await Student.find({ subjectCodes: { $in: subjects } });

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found for selected subjects" });
    }

    // Shuffle students randomly to prevent malpractice
    students.sort(() => Math.random() - 0.5);

    // Fetch classroom details
    const availableRooms = await Classroom.find({ name: { $in: classrooms } });

    let seatingPlan = [];
    let studentIndex = 0;
    let totalStudents = students.length;

    // Distribute students across classrooms
    for (const room of availableRooms) {
      let roomCapacity = Math.min(24, room.maxCapacity); // Default 24, but can go up to maxCapacity
      let assignedStudents = [];

      while (assignedStudents.length < roomCapacity && studentIndex < totalStudents) {
        assignedStudents.push({
          rollNumber: students[studentIndex].rollNumber,
          name: students[studentIndex].name,
          subjectCode: students[studentIndex].subjectCodes[0], // Assuming one subject per exam
          seatNumber: assignedStudents.length + 1 // Seat Number
        });
        studentIndex++;
      }

      seatingPlan.push({ classroom: room.name, students: assignedStudents });

      // If all students are assigned, break
      if (studentIndex >= totalStudents) break;
    }

    // If students are still left, distribute them to available classrooms beyond 24
    let remainingStudents = students.slice(studentIndex);
    for (let room of seatingPlan) {
      if (remainingStudents.length === 0) break;

      let remainingCapacity = availableRooms.find(r => r.name === room.classroom).maxCapacity - room.students.length;

      while (remainingCapacity > 0 && remainingStudents.length > 0) {
        room.students.push({
          rollNumber: remainingStudents[0].rollNumber,
          name: remainingStudents[0].name,
          subjectCode: remainingStudents[0].subjectCodes[0],
          seatNumber: room.students.length + 1
        });

        remainingStudents.shift();
        remainingCapacity--;
      }
    }

    if (remainingStudents.length > 0) {
      return res.status(400).json({ message: "Not enough classrooms to accommodate all students" });
    }

    // Save Seating Plan to Database
    const seatingPlanEntry = new SeatingPlan({
      examDate,
      subjects,
      classrooms,
      seats: seatingPlan
    });

    await seatingPlanEntry.save();

    res.status(201).json({ message: "Seating plan generated successfully", seatingPlan });
  } catch (error) {
    res.status(500).json({ message: "Error generating seating plan", error });
  }
});

module.exports = seatingPlanApi;
