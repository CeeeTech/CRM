const Status = require('../models/status')
const mongoose = require('mongoose')

async function getAllStatus(req, res) {
    try {
        const statuses = await Status.find()
        res.status(200).json(statuses)
    } catch (error) {
        console.log("Error fetching status:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }

}

async function getStatus(req, res) {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: "No such Status" })
    }

    const status = await Status.findById({ _id: id })

    if (!status) {
        res.status(400).json({ error: "No such Status" })
    }

    res.status(200).json(status)

}

module.exports = {
    getAllStatus,
    getStatus
}