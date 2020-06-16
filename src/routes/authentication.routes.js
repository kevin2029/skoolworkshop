const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authenication.controller');

router.post(
    '/register',
    AuthController.validateRegister,
    AuthController.register
);

router.post(
    '/register/admin',
    // AuthController.validateAdmin,
    AuthController.validateRegister,
    AuthController.register
);

router.post('/login', AuthController.validateLogin, AuthController.login);

module.exports = router;