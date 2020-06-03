const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/user.controller');
// authenticationcontroller

router.post('/user', usercontroller.validateUser, usercontroller.createUser);
router.delete(
    '/user/:userMail',
    usercontroller.checkDatabase,
    usercontroller.deleteUser
);
router.get('/user/:userMail', usercontroller.getOne);
router.get('/user', usercontroller.getAll);
router.put(
    '/user/:userMail',
    usercontroller.checkDatabase,
    usercontroller.validateUpdateUser,
    usercontroller.updateUser
);

module.exports = router;
