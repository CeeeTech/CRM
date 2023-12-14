const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    name: String
})

const course = mongoose.model('Course', courseSchema)

module.exports = course