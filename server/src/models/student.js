const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  contact_no: String,
  email: String,
  address: String
  // Add other fields as needed
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
