const express = require('express')
const router = express.Router()
const workshopcontroller = require('../controllers/workshop.controller')

router.post('/create', workshopcontroller.validateWorkshop,workshopcontroller.createWorkshop)
router.post('/delete', workshopcontroller.deleteWorkshop)

module.exports = router