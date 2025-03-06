const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema({
    day: { type: String, required: true },
    timeSlot: { type: String, required: true },
    roomNumber: { type: String, required: true },
    status: { type: String, enum: ["occupied", "free"], default: "occupied" }
});

module.exports = mongoose.model("Timetable", TimetableSchema);
