const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  subjectCode: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  studentCount: { type: Number, default: 0 }, // New field to store the total number of students
});

// Middleware to auto-update student count
// SubjectSchema.pre("save", function (next) {
//   this.studentCount = this.students.length;
//   next();
// });

module.exports = mongoose.model("Subject", SubjectSchema);
