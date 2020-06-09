const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/user.controller');
const userEditController = require('../controllers/user.edit.controller');
const authenticationcontroller = require('../controllers/authenication.controller');

router.post('/user', usercontroller.validateUser, usercontroller.createUser);
router.post('/user', usercontroller.checkDatabase, usercontroller.deleteUser);
router.post('/user', usercontroller.getOne);
router.post('/user', usercontroller.getAll);
router.post(
    '/user',
    usercontroller.checkDatabase,
    usercontroller.validateUpdateUser,
    usercontroller.updateUser
);

router.post('/edit', userEditController.validateEdit, userEditController.editUser);

module.exports = router;
