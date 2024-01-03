const { default: mongoose } = require('mongoose')
const FollowUp = require('../models/followUp')
const Status = require('../models/status')
const User = require('../models/user')

//get all followUps
async function getFollowUps(req, res) {
    try {
        const follow_up = await FollowUp.find()
        res.status(200).json(follow_up)
    } catch (error) {
        console.log("Error fetchong follow_up", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

//add new followup
async function addFollowUp(req, res) {
    const { lead_id, user, status, comment,date } = req.body

    //check if lead exist ini lead table
    if (!mongoose.Types.ObjectId.isValid(lead_id)) {
        res.status(400).json({ error: "no such lead" })
    }

    //check if status exists in status table
    const status_document = await Status.findOne({ name: status })
    if (!status_document) {
        res.status(400).json({ error: `Status not found: ${status}` })
    }

    //check if user exists in user tablers
    const user_document = await User.findOne({ name: user })
    if (!user_document) {
        res.status(400).json({ error: `User not found: ${user}` })
    }

    try {
        const newFollowUp = await FollowUp.create({ lead_id, user_id: user_document._id, status_id: status_document._id, comment, date:date });
        res.status(200).json(newFollowUp)
    } catch (error) {
        console.log("Error adding followup", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

//update followup
async function updateFollowUp(req, res) {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "no such follow up" })
    }

    const followup = await FollowUp.findByIdAndUpdate({ _id: id }, {
        ...req.body
    })

    if (!followup) {
        res.status(400).json({ error: "no such follow up" })
    }

    res.status(200).json(followup)

}


//get followup
async function getFollowUp(req, res) {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: "No such followup" })
    }

    const followup = await FollowUp.findById({ _id: id })

    if (!followup) {
        res.status(400).json({ error: "No such followup" })
    }

    res.status(200).json(followup)

}

async function getFollowUpsByLead(req, res) {
    const { lead_id } = req.params;

    try {
        const followUps = await FollowUp.find({ lead_id });
        res.status(200).json(followUps);
    } catch (error) {
        console.log("Error fetching follow-ups by lead_id", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}



module.exports = {
    getFollowUps,
    addFollowUp,
    updateFollowUp,
    getFollowUp,
    getFollowUpsByLead
}