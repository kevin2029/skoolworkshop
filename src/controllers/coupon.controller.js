const logger = require('../config/config').logger;
const assert = require('assert');
const connection = require('../config/database.connection');

let controller = {
    validateCoupon(req, res, next) {
        try {
            const {
                Code,
                Value,
                MaxBedrag,
                MaxGebruik
            } = req.body;
            assert(typeof Code === 'string', 'Code is missing.');
            assert(typeof Value === 'string', 'Value is missing.');
            assert(typeof MaxGebruik === 'number','Max uses is missing.');

            next();
        } catch (err) {
            res.status(400).json({
                message: 'Error adding coupon!',
                error: err.message
            });
        }
    },

    createCoupon(req, res, next) {
        // logger.info('createcoupon called');
        const coupon = req.body;
        let {Code, Value, MaxBedrag, MaxGebruik } = coupon;
        console.log('coupon =', coupon);

        let sqlQuery =
            'INSERT INTO `coupon` (`Code`, `Value`, `MaxBedrag`, `MaxGebruik`) VALUES (?, ?, ?, ?)';
        // logger.debug('createcoupon', 'sqlQuery =', sqlQuery);

        connection.connectDatabase(
            sqlQuery,
            [Code, Value, MaxBedrag, MaxGebruik ],
            (error, results, fields) => {
                if (error) {
                    console.log('createcoupon', error);
                    res.status(400).json({
                        message: 'coupon already exists!'
                    });
                }
                if (results) {
                    console.log('results: ', results);
                    res.status(200).json({
                        result: {
                            ...coupon
                        }
                    });
                }
            }
        );
    },

    checkDatabase(req, res, next) {
        const couponCode = req.params.couponCode;

        let sqlQuery =
            `SELECT Code FROM coupon WHERE Code = '` + couponCode + `'`;
        //logger.debug('checkDatabase', 'sqlQuery = ', sqlQuery);

        connection.connectDatabase(sqlQuery, (error, results, fields) => {
            if (error) {
                // logger.debug('checkDatabase', 'Coupon not found')
                res.status(400).json({
                    message: 'coupon not found'
                });
            } else {
                // logger.debug('checkDatabase', 'Coupon found')
                next();
            }
        });
    },
    // Check of coupon in db staat

    deleteCoupon(req, res, next) {
        // logger.info('deletecoupon called');
        const couponCode = req.params.couponCode;

        let sqlQuery =
            `DELETE FROM coupon WHERE Code = '` + couponCode + `'`;
        // logger.debug('deletecoupon', 'sqlQuery =', sqlQuery);

        connection.connectDatabase(sqlQuery, (error, results, fields) => {
            if (error) {
                console.log('deletecoupon', error);
                res.status(400).json({
                    message: 'deletecoupon failed',
                    error: error
                });
            } else {
                res.status(200).json({
                    message: 'coupon succesfully deleted!'
                });
            }
        });
    }
};

module.exports = controller;