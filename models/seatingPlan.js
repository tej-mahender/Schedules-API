const mongoose = require("mongoose");

const SeatingPlanSchema = new mongoose.Schema({
  examDate: { type: Date, required: true },
  subjects: [{ type: String, required: true }], // Selected subject codes
  classrooms: [{ type: String, required: true }], // Selected classrooms
  seats: [
    {
      classroom: String,
      students: [
        {
          rollNumber: String,
          name: String,
          subjectCode: String,
          seatNumber: Number // Seat position in room
        }
      ]
    }
  ]
});

module.exports = mongoose.model("SeatingPlan", SeatingPlanSchema);
