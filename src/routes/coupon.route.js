const express = require('express');
const router = express.Router();
const couponcontroller = require('../controllers/coupon.controller');

router.post('/coupon', couponcontroller.validateCoupon, couponcontroller.createCoupon);
router.delete('/coupon/:Code', couponcontroller.checkDatabase, couponcontroller.deleteCoupon);
router.get('/coupon/checkValue/:Code', couponcontroller.checkValidCoupon, couponcontroller.checkValue,
couponcontroller.workshopCouponHandler, couponcontroller.moneyCouponHandler, couponcontroller.percentageCouponHandler, couponcontroller.percentageMaxCouponHandler);

module.exports = router;