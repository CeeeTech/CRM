const Lead = require("../models/lead");
const Course = require("../models/course");
const Branch = require("../models/branch");
const Status = require("../models/status");
const Student = require("../models/student");

//get all leads
async function getLeads(req, res) {
    try {
        const leads = await Lead.find()
        res.status(200).json(leads)
    } catch (error) {
        console.error("Error fetching leads:", error)
        res.status(500).json({ error: "Internal Sserver Error" })
    }
}

//add new lead
async function addLead(req, res) {
    const { date, sheduled_at, sheduled_to, course_name, branch_name, status, student_name } = req.body

    //check if course_name exist in course table
    const course_doucument = await Course.findOne({name: course_name})

    if(!course_doucument){
        res.status(400).json({error: `course not found: ${course_name}`})
    }

    //check if branch_name exist in branch table
    const branch_doucument = await Branch.findOne({name: branch_name})

    if(!branch_doucument){
        res.status(400).json({error: `branch not found: ${branch_name}`})
    }

    //check if status exist in status table
    const status_document = await Status.findOne({name: status})

    if(!status_document){
        res.status(400).json({error: `status not found: ${status}`})
    }

    //check if student exist in student table
    const student_document = await Student.findOne({name: student_name})

    if(!student_document){
        res.status(400).json({error: `student not found: ${student_name}`})
    }

    try {
        const newLead = await Lead.create({date, sheduled_at, sheduled_to, course_id: course_doucument._id, branch_id:branch_doucument._id, status_id:status_document._id, student_id:student_document._id})
        res.status(200).json(newLead)
    } catch (error) {
        console.log('Error adding leads:', error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = {
    getLeads,
    addLead,
}