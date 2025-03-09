const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const Student = require("../models/Student");
const Subject = require("../models/Subject");

const studentApi = express.Router();

// Multer storage setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to upload and process Excel file
studentApi.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log("Extracted Data from Excel:", data); // Debugging


    if (!data.length) {
      return res.status(400).json({ message: "Empty Excel file" });
    }

    let updatedStudents = [];

    for (const row of data) {        
      // Mapping the Excel columns to match the schema
      const name = row["Name"]; // Match column name in Excel
      const rollNumber = row["Roll No"]; // Match column name in Excel
      const subjectCodes = row["Subject codes"]; // Match column name in Excel
      const semester = 6; // Assuming semester is fixed or you can add a column for it

      if (!name || !rollNumber || !subjectCodes) {
        console.log("Skipping row due to missing data:", row);
        continue;
      }

        const subjectList = subjectCodes.split(",").map(code => code.trim());

        console.log("Processing student:", name, rollNumber, subjectList); // Debugging

        // Find or create student
        let student = await Student.findOne({ rollNumber });

        if (!student) {
          student = new Student({ name, rollNumber, semester, subjectCodes: subjectList });
        } else {
          student.subjectCodes = [...new Set([...student.subjectCodes, ...subjectList])];
        }

        await student.save();
        updatedStudents.push(student);

        // Update subject count
        for (const code of subjectList) {
          const subject = await Subject.findOne({ subjectCode: code });

          if (subject && !subject.students.includes(student._id)) {
            subject.students.push(student._id);
            subject.studentCount += 1;
            await subject.save();
          }
        }
      }

    res.status(200).json({ message: "Students & Subjects updated", updatedStudents });
   } 
  catch (error) {
    res.status(500).json({ message: "Error processing file", error });
  }
});

module.exports = studentApi;
