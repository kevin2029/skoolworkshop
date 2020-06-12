const express = require('express');
const router = express.Router();
const couponcontroller = require('../controllers/coupon.controller');

router.post(
    '/',
    couponcontroller.validateCoupon,
    couponcontroller.createCoupon
);
router.get('/all', couponcontroller.getAll);
router.get('/:Id', couponcontroller.getOne);
router.delete(
    '/:Code',
    couponcontroller.checkDatabase,
    couponcontroller.deleteCoupon
);

module.exports = router;
