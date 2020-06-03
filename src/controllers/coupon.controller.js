const logger = require('../config/config').logger;
const assert = require('assert');
const connection = require('../config/database.connection');

let controller = {
    validateCoupon(req, res, next) {
        logger.info('validatecoupon called', req.body);
        try {
            const {codeCoupon, valueCoupon, maxBedragCoupon, maxGebruikCoupon } = req.body;
            assert(typeof codeCoupon === 'string', 'Code is missing.');
            assert(typeof valueCoupon === 'string', 'Value is missing.');
            assert(typeof maxGebruikCoupon === 'string','Max uses is missing.');

            next();
        } catch (err) {
            logger.debug('Error', err);
            res.status(400).json({
                message: 'Error adding coupon!',
                error: err.message
            });
        }
    },

    createCoupon(req, res, next) {
        logger.info('createcoupon called');
        const coupon = req.body;
        let {codeCoupon, valueCoupon, maxBedragCoupon, maxGebruikCoupon } = coupon;
        logger.debug('coupon =', coupon);

        let sqlQuery =
            'INSERT INTO `Cadeaubon` (`Code`, `Value`, `MaxBedrag`, `MaxGebruik`) VALUES (?, ?, ?, ?)';
        logger.debug('createcoupon', 'sqlQuery =', sqlQuery);

        connection.connectDatabase(
            sqlQuery,
            [codeCoupon, valueCoupon, maxBedragCoupon, maxGebruikCoupon ],
            (error, results, fields) => {
                if (error) {
                    logger.debug('createcoupon', error);
                    res.status(400).json({
                        message: 'coupon already exists!'
                    });
                }
                if (results) {
                    logger.debug('results: ', results);
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
        logger.info('checkDatabase called')
        const couponCode = req.params.couponCode;

        let sqlQuery =
            `SELECT Code FROM Cadeaubon WHERE Code = '` + couponCode + `'`;
        logger.debug('checkDatabase', 'sqlQuery = ', sqlQuery);

        connection.connectDatabase(sqlQuery, (error, results, fields) => {
            if (error) {
                logger.debug('checkDatabase', 'Coupon not found')
                res.status(400).json({
                    message: 'coupon not found'
                });
            } else {
                logger.debug('checkDatabase', 'Coupon found')
                next();
            }
        });
    },
    // Check of coupon in db staat

    deleteCoupon(req, res, next) {
        logger.info('deletecoupon called');
        const couponCode = req.params.couponCode;

        let sqlQuery =
            `DELETE FROM Cadeaubon WHERE Code = '` + couponCode + `'`;
        logger.debug('deletecoupon', 'sqlQuery =', sqlQuery);

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