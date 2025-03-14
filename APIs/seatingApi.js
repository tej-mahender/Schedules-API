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

    // Fetch students enrolled in selected subjects and sort by roll number
    let students = await Student.find({ subjectCodes: { $in: subjects } });

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found for selected subjects" });
    }

    // ✅ Sort students by roll number in ascending order
    students.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));

    // Fetch classroom details
    const availableRooms = await Classroom.find({ name: { $in: classrooms } });

    // ✅ Calculate ideal number of students per classroom
    let totalStudents = students.length;
    let totalRooms = availableRooms.length;
    let studentsPerRoom = Math.ceil(totalStudents / totalRooms); // Ensure all students are evenly distributed

    let seatingPlan = [];
    let studentIndex = 0;

    // ✅ Assign students in roll number order, distributing them evenly
    for (const room of availableRooms) {
      let roomCapacity = Math.min(studentsPerRoom, room.maxCapacity); // Assign evenly but respect max capacity
      let assignedStudents = [];

      for (let i = 0; i < roomCapacity && studentIndex < totalStudents; i++) {
        assignedStudents.push({
          rollNumber: students[studentIndex].rollNumber,
          name: students[studentIndex].name,
          subjectCode: students[studentIndex].subjectCodes[0],
          seatNumber: i + 1
        });
        studentIndex++;
      }

      seatingPlan.push({ classroom: room.name, students: assignedStudents });

      if (studentIndex >= totalStudents) break;
    }

    // ✅ If students remain, they are added sequentially in order to classrooms
    while (studentIndex < totalStudents) {
      for (let room of seatingPlan) {
        if (studentIndex >= totalStudents) break;
        let maxCapacity = availableRooms.find(r => r.name === room.classroom).maxCapacity;
        
        if (room.students.length < maxCapacity) {
          room.students.push({
            rollNumber: students[studentIndex].rollNumber,
            name: students[studentIndex].name,
            subjectCode: students[studentIndex].subjectCodes[0],
            seatNumber: room.students.length + 1
          });
          studentIndex++;
        }
      }
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


// ✅ Get Full Exam Schedule (Sorted)
seatingPlanApi.get("/schedule", async (req, res) => {
  try {
    const schedule = await SeatingPlan.findOne();

    if (!schedule) {
      return res.status(404).json({ message: "No exam schedule found" });
    }

    // Sort students within each classroom
    const sortedSchedule = {
      ...schedule.toObject(),
      seats: schedule.seats.map(room => ({
        classroom: room.classroom,
        students: room.students.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber))
      }))
    };

    res.status(200).json({ message: "Exam schedule retrieved", schedule: sortedSchedule });
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedule", error });
  }
});

// ✅ Get Student's Room & Seat Number by Roll Number
seatingPlanApi.get("/seating/:rollNumber", async (req, res) => {
  try {
    const { rollNumber } = req.params;

    // Fetch the latest seating plan
    const seatingPlan = await SeatingPlan.findOne();
    if (!seatingPlan) {
      return res.status(404).json({ message: "No seating plan available" });
    }

    let studentSeat = null;
    
    // Search for the student in the seating plan
    for (const room of seatingPlan.seats) {
      const foundStudent = room.students.find(student => student.rollNumber === rollNumber);
      if (foundStudent) {
        studentSeat = {
          classroom: room.classroom,
          seatNumber: foundStudent.seatNumber,
          studentName: foundStudent.name,
          subjectCode: foundStudent.subjectCode
        };
        break;
      }
    }

    if (!studentSeat) {
      return res.status(404).json({ message: "Student not found in seating plan" });
    }

    res.status(200).json({ message: "Seating details retrieved", seatingDetails: studentSeat });
  } catch (error) {
    res.status(500).json({ message: "Error fetching seating details", error });
  }
});

module.exports = seatingPlanApi;
