const express = require("express");
const studentController = require("../controllers/studentController");

const router = express.Router();

router.get("/students", studentController.getStudents);
router.post("/students", studentController.addStudent);
router.get('/students/:id', studentController.getStudent)
router.patch('/students/:id', studentController.updateStudent)


module.exports = router;
