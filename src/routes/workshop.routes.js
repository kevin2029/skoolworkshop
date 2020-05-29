const express = require('express');
const router = express.Router();
const workshopcontroller = require('../controllers/workshop.controller');
// authcontroller

router.post(
    '/workshop',
    workshopcontroller.validateWorkshop,
    workshopcontroller.createWorkshop
);
router.delete('/workshop/:workshopNaam', workshopcontroller.deleteWorkshop);

module.exports = router;
