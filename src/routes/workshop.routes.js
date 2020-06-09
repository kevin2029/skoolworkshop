const express = require('express');
const router = express.Router();
const workshopcontroller = require('../controllers/workshop.controller');
const authcontroller = require('../controllers/authenication.controller');

router.post(
    '/create',
    workshopcontroller.validateWorkshop,
    workshopcontroller.createWorkshop
);
router.post('/delete', workshopcontroller.deleteWorkshop);
router.post('/getone', workshopcontroller.getOne);
router.post('/getall', workshopcontroller.getAll);
router.post(
    '/update',
    workshopcontroller.checkDatabase,
    workshopcontroller.validateWorkshop,
    workshopcontroller.updateWorkshop
);

module.exports = router;
