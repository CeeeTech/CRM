const express = require("express")
const followUpController = require('../controllers/followUpController')

const router = express.Router()

router.get('/followUps', followUpController.getFollowUp)
router.post('/followUps', followUpController.addFollowUp)
router.patch('/followUps/:id', followUpController.updateFollowUp)

module.exports = router