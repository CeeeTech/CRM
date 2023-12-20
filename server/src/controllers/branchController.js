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

const addBranch = async (req, res) => {
    const { name } = req.body

    //add doc to db
    try {
        const branch = await Branch.create({ name })
        res.status(200).json(branch)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getBranches,
    addBranch
}