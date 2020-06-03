const express = require('express');
const router = express.Router();
const couponcontroller = require('../controllers/coupon.controller');

router.post('/coupon', couponcontroller.validateCoupon, couponcontroller.createCoupon);

module.exports = router;