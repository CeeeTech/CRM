const express = require('express')
const leadController = require('../controllers/leadController')

const router = express.Router()

router.get('/leads', leadController.getLeads)
router.post('/leads', leadController.addLead)

module.exports = router