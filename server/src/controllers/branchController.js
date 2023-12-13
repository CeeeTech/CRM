const Branch = require('../models/branch')

async function getBranches(req, res) {
    try {
        const branches = await Branch.find()
        res.status(200).json(branches)
    } catch (error) {
        console.log("Error fetching branches:", error)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = {
    getBranches,
}