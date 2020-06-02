const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/coupon.controller');

router.post('/coupon', usercontroller.validateUser, usercontroller.createUser);

module.exports = router;