const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ["Lab", "Classroom"], required: true },
    capacity: { type: Number, required: true },
    status: { type: String, enum: ["free", "occupied"], default: "free" }
});

module.exports = mongoose.model("Room", RoomSchema);
