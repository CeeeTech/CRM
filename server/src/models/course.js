const mongoose = require('mongoose')

const courseSchema = mongoose.Schema({
    name: String
})

const course = mongoose.model('Course', courseSchema)

module.exports(course)