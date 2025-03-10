const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, unique: true, required: true },
  subjectCodes: [{ type: String }], // List of subjects student is enrolled in
  semester: { type: Number, required: true }
});

module.exports = mongoose.model("Student", StudentSchema);
