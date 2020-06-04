const express = require('express');
const router = express.Router();
const workshopcontroller = require('../controllers/workshop.controller');
// authcontroller

router.post('/workshop', workshopcontroller.validateWorkshop, workshopcontroller.createWorkshop)
router.delete('/delete/:naamWorkshop', workshopcontroller.deleteWorkshop)
router.get('/getOne', workshopcontroller.getOne)
router.get('/getAll', workshopcontroller.getAll)
router.put('/update/:naamWorkshop', workshopcontroller.validateUpdateWorkshop, workshopcontroller.updateWorkshop)

module.exports = router;
