const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  facultyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Faculty", 
    required: true 
  },
  empID: {
    type: String,
    ref: "Faculty",
    required: true
  },
  schedule:[
    {
      day: { 
        type: String, 
        required: true, 
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] 
      },
      occupiedPeriods: { 
        type: [Number], 
        validate: {
          validator: periods => periods.every(p => p >= 1 && p <= 8),
          message: "Periods must be between 1 and 8"
        }
      },
      freePeriods: { 
        type: [Number], 
        validate: {
          validator: periods => periods.every(p => p >= 1 && p <= 8),
          message: "Periods must be between 1 and 8"
        }
      }
    }
  ]
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
