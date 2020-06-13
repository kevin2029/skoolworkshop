const express = require('express');
const router = express.Router();
const organisationController = require('../controllers/organisation.controller');

router.post(
    '/create',
    organisationController.validateOrganisation,
    organisationController.createOrganisation
);
router.get('/getAll', organisationController.getAll);
router.post('/delete/:Naam', organisationController.deleteOrganisation);

module.exports = router;
