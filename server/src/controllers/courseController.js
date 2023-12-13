const Course = require('../models/course')

async function getCourses(req, res) {
    try {
        const courses = await Course.find()
        res.status(200).json(courses)
    } catch (error) {
        console.log("Error fetching courses:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }

}

module.exports = {
    getCourses,
}