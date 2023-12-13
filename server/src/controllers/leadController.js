const Lead = require("../models/lead");

async function getLeads(req, res){
    try{
        const leads = await Lead.find()
        res.status(200).json(leads)
    }catch(error){
        console.error("Error fetching leads:",  error)
        res.status(500).json({error: "Internal Sserver Error"})
    }
}

module.exports = {
    getLeads,
}