const mongoose = require("mongoose");

const ClassroomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  maxCapacity: { type: Number, required: true } // Max students allowed
});

module.exports = mongoose.model("Classroom", ClassroomSchema);
