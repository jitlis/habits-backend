const { intervalToDuration, startOfWeek, format } = require("date-fns");
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    // type: String,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  hours: {
    type: Number,
    required: true,
  },
  hoursCompleted: {
    type: Number,
    required: true,
    default: 0,
  },
  startDate: {
    type: Date,
    default: new Date,
    required: true,
  },
});
module.exports = mongoose.model("Task", taskSchema);
