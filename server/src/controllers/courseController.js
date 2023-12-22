const Course = require('../models/course')
const mongoose = require('mongoose')
 
async function getCourses(req, res) {
    try {
        const courses = await Course.find()
        res.status(200).json(courses)
    } catch (error) {
        console.log("Error fetching courses:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }

}

async function getCourse(req, res) {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: "No such course" })
    }

    const course = await Course.findById({ _id: id })

    if (!course) {
        res.status(400).json({ error: "No such course" })
    }

    res.status(200).json(course)

}

module.exports = {
    getCourses,
    getCourse
}