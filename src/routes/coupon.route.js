const express = require('express');
const router = express.Router();
const couponcontroller = require('../controllers/coupon.controller');
const authcontroller = require('../controllers/authenication.controller');

router.post(
    '/create',
    couponcontroller.validateCoupon,
    couponcontroller.createCoupon
);
router.post(
    '/delete/:ID',
    couponcontroller.checkDatabase,
    couponcontroller.deleteCoupon
);
router.get(
    '/use/:Code/:Workshop',
    couponcontroller.checkValidCoupon,
    couponcontroller.checkValue,
    couponcontroller.workshopCouponHandler,
    couponcontroller.moneyCouponHandler,
    couponcontroller.percentageCouponHandler,
    couponcontroller.percentageMaxCouponHandler
);

router.get('/getall', couponcontroller.getAll);

module.exports = router;