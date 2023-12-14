const Status = require('../models/status')

async function getStatus(req, res) {
    try {
        const statuses = await Status.find()
        res.status(200).json(statuses)
    } catch (error) {
        console.log("Error fetching status:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }

}

module.exports = {
    getStatus,
}