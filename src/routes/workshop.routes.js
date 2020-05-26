const express = require('express')
const router = express.Router()
const workshopcontroller = require('../controllers/workshop.controller')

router.post('/createworkshop', workshopcontroller.createWorkshop)

module.exports = router