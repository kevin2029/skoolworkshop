const express = require('express');
const router = express.Router();
const workshopcontroller = require('../controllers/workshop.controller');
const authcontroller = require('../controllers/authenication.controller');

router.post(
    '/workshop',
    workshopcontroller.validateWorkshop,
    workshopcontroller.createWorkshop
);
router.delete(
    '/workshop/:workshopNaam',
    workshopcontroller.checkDatabase,
    workshopcontroller.deleteWorkshop
);

module.exports = router;
