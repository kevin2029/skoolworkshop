const express = require('express');
const router = express.Router();
const bookingcontroller = require('../controllers/booking.controller');
const authcontroller = require('../controllers/authenication.controller');

router.post('/create/:ID', bookingcontroller.validateBooking, bookingcontroller.createBooking);

module.exports = router;