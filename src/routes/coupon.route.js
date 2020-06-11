const express = require('express');
const router = express.Router();
const couponcontroller = require('../controllers/coupon.controller');

router.post('/coupon', couponcontroller.validateCoupon, couponcontroller.createCoupon);
router.get('/coupon/:Code', couponcontroller.checkValidCoupon, couponcontroller.getOne);
router.delete('/coupon/:Code', couponcontroller.checkDatabase, couponcontroller.deleteCoupon);
router.get('/coupon/test/:Code', couponcontroller.useCoupon);

module.exports = router;