const express = require('express');
const router = express.Router();
const couponcontroller = require('../controllers/coupon.controller');

router.post('/create', couponcontroller.validateCoupon, couponcontroller.createCoupon);
router.delete('/delete/:Code', couponcontroller.checkDatabase, couponcontroller.deleteCoupon);
router.get('/use/:Code/:Price', couponcontroller.checkValidCoupon, couponcontroller.checkValue,
couponcontroller.workshopCouponHandler, couponcontroller.moneyCouponHandler, 
couponcontroller.percentageCouponHandler, couponcontroller.percentageMaxCouponHandler, couponcontroller.updateCoupon);

module.exports = router;