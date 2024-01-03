const express = require('express')
const courseController = require('../controllers/courseController')

const router = express.Router()

router.get('/courses', courseController.getCourses)
router.get('/courses/:id', courseController.getCourse)
router.post('/course-form', courseController.addCourse)
router.put('/course-form/:id', courseController.updateCourse)
router.put('/disable-enable-course/:id', courseController.disableEnableCourse)

module.exports = router