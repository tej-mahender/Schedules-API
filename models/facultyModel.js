const mongoose = require("mongoose");

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
    designation:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique : true
    },
    department:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("Faculty", FacultySchema);
