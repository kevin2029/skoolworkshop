const logger = require('../config/config').logger;
const assert = require('assert');
const connection = require('../config/database.connection');
const express = require('express');
const router = express.Router();

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
            'INSERT INTO `Cadeaubon` (`Code`, `Value`, `MaxBedrag`, `MaxGebruik`, `AantalGebruikt`) VALUES (?, ?, ?, ?, 0)';
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
        const couponCode = req.params.Code;

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
        const couponCode = req.params.Code;

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
    },

    checkValidCoupon(req, res, next) {
        logger.info('checkValidCoupon called');
        const couponCode = req.params.Code;

        let sqlQuery = 
            `SELECT MaxGebruik, AantalGebruikt FROM Cadeaubon WHERE Code = '` + couponCode + `';`
        logger.debug('checkValidCoupon', 'sqlQuery = ', sqlQuery);

        connection.connectDatabase(sqlQuery, (error, results, fields) => {
            if (error) {
                console.log('checkValidCoupon ', error);
                res.status(400).json({
                    message: 'checkValidCoupon failed',
                    error: error
                });

            } else {
                console.log(results);
                for (var i = 0; i < results.length; i++) {
                    logger.debug("parsedJSON: ", results[i]);
                    const MaxGebruik = results[i].MaxGebruik;
                    const AantalGebruikt = results[i].AantalGebruikt;
                    if (AantalGebruikt < MaxGebruik) {
                        next();
                    } else {
                        res.status(200).json({
                            message: 'Coupon is invalid',
                        })
                    }
                }
            }

        })
    },

    getOne(couponCode, callback) {
        logger.info("getOne called");

        const query =
            `SELECT Code, Value, MaxBedrag, MaxGebruik, AantalGebruikt FROM Cadeaubon WHERE Code = '` +
            couponCode +
            `';`;

        logger.info('getOne:', couponCode);

        connection.connectDatabase(query, (error, results, fields) => {
            if (error) {
                logger.debug(couponCode, query, error);
                return 'coupon does not exist!';
            } else {
                logger.debug("results: ", results[0]);
                callback(results);
            }
        });
        
    },

    checkValue(req, res, next) {
        logger.info("checkValue called");
        const couponCode = req.params.Code;
        logger.debug("Couponcode: ", couponCode);
        let getOneResults;
        controller.getOne(couponCode, (results) => {
            logger.debug("results: ", results);
            getOneResults = results[0];
            const couponValue = getOneResults.Value;
            logger.debug(couponValue);
            const cMOR = couponValue.substring(couponValue.length - 1);
            logger.debug("Substring check: ", cMOR);

            if (couponValue.endsWith(Number)) {
                router.get('/coupon/money/' + couponCode, controller.useCoupon(), controller.moneyCouponHandler());
            } else if (couponValue.endsWith("%") && getOneResults.maxBedragCoupon == undefined || getOneResults.maxBedragCoupon == null) {
                logger.debug("couponCode: ", couponCode);
                router.get(`/coupon/percentage/` + couponCode, controller.useCoupon(), controller.percentageCouponHandler());
            } else if (cMOR == "%" && getOneResults.maxBedragCoupon != undefined || getOneResults.maxBedragCoupon != null) {
                router.get('/coupon/percentageMax/' + couponCode);
            } else if (couponValue == "workshop") {
                router.get('/coupon/workshop/' + couponCode);
            } else {
                logger.debug("Error, invalid type");
                res.status(400).json({
                    message: "Error, invalid type"
                })
            }

            // switch (couponValue) {
            //     case checkMoneyOrPercentage == 0 || 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9:
            //         route.use('/coupon/money/' + couponCode);
            //     case checkMoneyOrPercentage == "%" && getOneResults.maxBedragCoupon == undefined:
            //         route.use('/coupon/percentage/' + couponCode);
            //     case checkMoneyOrPercentage == "%" && getOneResults.maxBedragCoupon != undefined:
            //         route.use('/coupon/percentageMax/' + couponCode);
            //     case "workshop":
            //         route.use('/coupon/workshop/' + couponCode);
            //     default:
            //         logger.debug("Error, default reached");
            //         res.status(400).json({
            //             message: "Error, default reached"
            //         })
            // }

        });

    },

    useCoupon(req, res, next) {
        logger.info("useCoupon called");
        const couponCode = req.params.Code;
        logger.debug("Couponcode: ", couponCode);
        let getOneResults;
        controller.getOne(couponCode, (results) => {
            getOneResults = results[0];
            const couponValue = getOneResults.Value;
            logger.debug(couponValue);
            req.coupon = getOneResults;
            next();
        });
    },

    updateCoupon(couponCode) {
        logger.info("updateCoupon called");

        let getOneResults;
        controller.getOne(couponCode, (results) => {
            logger.debug("results: ", results);
            getOneResults = results[0];
            let couponAantalGebruikt = getOneResults.AantalGebruikt;
            logger.debug(couponValue);

            couponAantalGebruikt += 1;
            
            const query = 
                `UPDATE Cadeaubon SET AantalGebruikt = '` + couponAantalGebruikt
                 + `' WHERE Code = '` + couponCode + `';`;

            connection.connectDatabase(query, (error, results, fields) => {
                if (error) {
                    logger.debug(couponCode, query, error);
                    
                } else {
                    logger.debug("results: ", results[0]);
                }
            });

            res.status(200).json({
            result: results[0]
            });
        });

    },

    workshopCouponHandler(req, res, next) {
        logger.info("workshopCouponHandler called");
        const coupon = req.coupon;

        res.status(200).json({
            message: 'Coupon succesfully sent!',
            result: coupon
        });
    },

    moneyCouponHandler(req, res, next) {
        logger.info("moneyCouponHandler called");
        const coupon = req.coupon;

        res.status(200).json({
            message: 'Coupon succesfully sent!',
            result: coupon
        });
    },

    percentageCouponHandler(req, res, next) {
        logger.info("percentageCouponHandler called");
        const coupon = req.coupon;

        res.status(200).json({
            message: 'Coupon succesfully sent!',
            result: coupon
        });
    },

    percentageMaxCouponHandler(req, res, next) {
        logger.info("percentageMaxCouponHandler called");
        const coupon = req.coupon;

        res.status(200).json({
            message: 'Coupon succesfully sent!',
            result: coupon
        });
    }
};

module.exports = controller;
