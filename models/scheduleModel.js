const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  day: String,
  occupiedPeriods: [Number],
  freePeriods: [Number]
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
