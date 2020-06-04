const express = require('express');
const router = express.Router();
const workshopcontroller = require('../controllers/workshop.controller');
// authcontroller

router.post('/workshop', workshopcontroller.validateWorkshop, workshopcontroller.createWorkshop)
router.delete('/workshop/:naamWorkshop', workshopcontroller.deleteWorkshop)
router.get('/workshop/:naamWorkshop', workshopcontroller.getOne)
router.get('/workshop', workshopcontroller.getAll)
router.put('/workshop/:naamWorkshop', workshopcontroller.validateUpdateWorkshop, workshopcontroller.updateWorkshop)

module.exports = router;
