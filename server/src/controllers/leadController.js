const Lead = require("../models/lead");

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
    const { date, sheduled_at, sheduled_to, course_id, branch_id, status_id } = req.body

    try {
        const Lead = await Lead.create({date, sheduled_at, sheduled_to, course_id, branch_id, status_id})
    } catch (error) {
        console.log('Error adding leads:', error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = {
    getLeads,
    addLead,
}