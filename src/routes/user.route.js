const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/user.controller');
const userEditController = require('../controllers/user.edit.controller');
const authenticationcontroller = require('../controllers/authenication.controller');

router.post('/create', usercontroller.validateUser, usercontroller.createUser);
router.delete(
    '/delete',
    usercontroller.checkDatabase,
    usercontroller.deleteUser
);
router.get('/getone', usercontroller.getOne);
router.get('/getall', usercontroller.getAll);
router.put(
    '/update',
    usercontroller.checkDatabase,
    usercontroller.validateUpdateUser,
    usercontroller.updateUser
);

router.post(
    '/edit',
    authenticationcontroller.validateToken,
    userEditController.validateEdit,
    userEditController.editUser
);

module.exports = router;
