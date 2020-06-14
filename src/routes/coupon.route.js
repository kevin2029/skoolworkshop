const express = require('express');
const router = express.Router();
const couponcontroller = require('../controllers/coupon.controller');
const authcontroller = require('../controllers/authenication.controller');

router.post(
    '/create',
    // authcontroller.validateAdmin,
    couponcontroller.validateCoupon,
    couponcontroller.createCoupon
);
router.post(
    '/delete/:ID',
    // authcontroller.validateAdmin,
    couponcontroller.checkDatabase,
    couponcontroller.deleteCoupon
);
router.get(
    '/use/:Code',
    couponcontroller.checkValidCoupon,
    couponcontroller.checkValue,
    couponcontroller.workshopCouponHandler,
    couponcontroller.moneyCouponHandler,
    couponcontroller.percentageCouponHandler,
    couponcontroller.percentageMaxCouponHandler,
    couponcontroller.updateCoupon
);
router.get('/getall', couponcontroller.getAll);

module.exports = router;
