const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/user.controller');
const userEditController = require('../controllers/user.edit.controller');
const authenticationcontroller = require('../controllers/authenication.controller');

router.post(
    '/create',
    // authenticationcontroller.validateAdmin,
    usercontroller.validateUser,
    usercontroller.createUser
);
router.post(
    '/delete/:Id',
    // authenticationcontroller.validateAdmin,
    usercontroller.checkDatabase,
    usercontroller.deleteUser
);
router.get('/getone/:userID', usercontroller.getOne);
router.get('/getall', usercontroller.getAll);
router.post(
    '/update',
    usercontroller.checkDatabase,
    usercontroller.validateUser,
    usercontroller.updateUser
);
router.post('/uploadimage', usercontroller.uploadImage);

router.post(
    '/edit/:userID',
    userEditController.validateEdit,
    userEditController.editUser
);

module.exports = router;