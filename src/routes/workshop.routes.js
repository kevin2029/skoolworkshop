const express = require('express')
const router = express.Router()
const workshopcontroller = require('../controllers/workshop.controller')

router.post('/create', workshopcontroller.validateWorkshop, workshopcontroller.createWorkshop)
router.post('/delete', workshopcontroller.deleteWorkshop)
router.post('/getOne', workshopcontroller.getOne)
router.post('/getAll', workshopcontroller.getAll)
router.post('/update', 
workshopcontroller.checkDatabase, 
workshopcontroller.validateUpdateUser, 
workshopcontroller.updateWorkshop)

module.exports = router