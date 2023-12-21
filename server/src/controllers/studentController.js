const Student = require("../models/student");

async function getStudents(req, res) {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function addStudent(req, res) {
  const { name, dob, contact_no, email, address } = req.body;
  try {
    const student = await Student.create({ name, dob, contact_no, email, address })
    res.status(200).json(student)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getStudents,
  addStudent
};
