const mongoose = require('mongoose')

const leadSchema = new mongoose.Schema({
    date: Date,
    sheduled_at: Date,
    sheduled_to: Date,
    course_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    branch_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Branch'},
    status_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Status'},
    student_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'}
})

const lead = mongoose.model('Lead', leadSchema)

module.exports = lead