const express = require('express');
const router = express.Router();
const workshopcontroller = require('../controllers/workshop.controller');
const authcontroller = require('../controllers/authenication.controller');

router.post(
    '/create',
    workshopcontroller.validateWorkshop,
    workshopcontroller.createWorkshop
);
router.post('/delete/:Naam', workshopcontroller.deleteWorkshop);
router.get('/getone/:Id', workshopcontroller.getOne);
router.get('/getall', workshopcontroller.getAll);
router.post(
    '/update',
    workshopcontroller.checkDatabase,
    workshopcontroller.validateWorkshop,
    workshopcontroller.updateWorkshop
);

router.get('/getWorkshopUser/:Email', workshopcontroller.getAll);

module.exports = router;
