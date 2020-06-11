const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/user.controller');
const authenticationcontroller = require('../controllers/authenication.controller');

router.post('/create', usercontroller.validateUser, usercontroller.createUser);
router.post('/delete', usercontroller.checkDatabase, usercontroller.deleteUser);
router.get('/getone', usercontroller.getOne);
router.get('/getall', usercontroller.getAll);
router.post(
    '/update',
    usercontroller.checkDatabase,
    usercontroller.validateUpdateUser,
    usercontroller.updateUser
);
router.post('/uploadimage', usercontroller.uploadImage);

module.exports = router;
