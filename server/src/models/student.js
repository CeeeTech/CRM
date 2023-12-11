const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  // Add other fields as needed
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
