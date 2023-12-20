const express = require('express')
const branchController = require('../controllers/branchController')

const router = express.Router()

router.get('/branches', branchController.getBranches)
router.post('/branches', branchController.addBranch)

module.exports = router