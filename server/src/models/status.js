const mongoose = require("mongoose");

const statusSchema = mongoose.Schema({
    name: String
})

const status = mongoose.model('Status', statusSchema)

module.exports(status)