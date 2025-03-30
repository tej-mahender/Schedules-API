const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const FacultySchema = new mongoose.Schema({
    empID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["faculty", "hod", "admin"],  // Only HOD and Admin can log in
        default: "faculty"
    },
    password: {
        type: String,
        required: true
    }
});

// Compare passwords for login
FacultySchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Faculty", FacultySchema);
