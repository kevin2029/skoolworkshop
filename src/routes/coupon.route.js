const express = require('express');
const router = express.Router();
const couponcontroller = require('../controllers/coupon.controller');

router.post('/coupon', couponcontroller.validateCoupon, couponcontroller.createCoupon);
router.delete('/coupon/:Code', couponcontroller.checkDatabase, couponcontroller.deleteCoupon);
router.use('/coupon/checkValue', couponcontroller.checkValidCoupon, couponcontroller.checkValue);
router.get('/coupon/workshop/:Code', couponcontroller.useCoupon, couponcontroller.workshopCouponHandler);
router.get('/coupon/money/:Code', couponcontroller.useCoupon, couponcontroller.workshopCouponHandler);
router.get('/coupon/percentage/:Code', couponcontroller.useCoupon, couponcontroller.workshopCouponHandler);
router.get('/coupon/percantageMax/:Code', couponcontroller.useCoupon, couponcontroller.workshopCouponHandler);

module.exports = router;