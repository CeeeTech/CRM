const express = require('express')
const leadController = require('../controllers/leadController')

const router = express.Router()

router.get('/leads', leadController.getLeads)
router.post('/leads', leadController.addLead)
router.get('/leads/:id', leadController.getLead)
router.patch('/leads/:id', leadController.updateLead)

module.exports = router