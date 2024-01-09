const Student = require("../models/student");
const mongoose = require('mongoose')

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

async function getStudent(req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ error: "No such Student" })
  }

  const student = await Student.findById({ _id: id })

  if (!student) {
      res.status(400).json({ error: "No such Student" })
  }

  res.status(200).json(student)

}

//update student
async function updateStudent(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: "No such Student" });
  }

  const student = await Student.findByIdAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!student) {
    res.status(400).json({ error: "no such Student" });
  }

  res.status(200).json(student);
}

module.exports = {
  getStudents,
  addStudent,
  getStudent,
  updateStudent,
  
};
