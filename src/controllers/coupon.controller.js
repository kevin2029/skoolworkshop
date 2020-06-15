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
                for (var i = 0; i < 1; i++) {
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
        const price = req.params.Price;
        logger.debug("Couponcode: ", couponCode, "Price: ", price);
        let getOneResults;
        controller.getOne(couponCode, (results) => {
            getOneResults = results[0];
            const couponValue = getOneResults.Value;
            logger.debug("couponValue: ", couponValue);
            req.coupon = getOneResults;
            req.price = price;
            let valueString;

            if (couponValue.charAt(couponValue.length - 1) == 0 || couponValue.charAt(couponValue.length - 1) == 1 ||
            couponValue.charAt(couponValue.length - 1) == 2 || couponValue.charAt(couponValue.length - 1) == 3 ||
            couponValue.charAt(couponValue.length - 1) == 4 || couponValue.charAt(couponValue.length - 1) == 5 || 
            couponValue.charAt(couponValue.length - 1) == 6 || couponValue.charAt(couponValue.length - 1) == 7 || 
            couponValue.charAt(couponValue.length - 1) == 8 || couponValue.charAt(couponValue.length - 1) == 9) {
                valueString = "Money";
                req.valueString = valueString;
                logger.debug("req.valueString: ", req.valueString);
                next();
            } else if (couponValue.endsWith("%") && getOneResults.maxBedragCoupon == undefined) {
                valueString = "Percentage";
                req.valueString = valueString;
                logger.debug(valueString);
                next();
            } else if (couponValue.endsWith("%") && getOneResults.maxBedragCoupon != undefined) {
                valueString = "PercentageMax";
                req.valueString = valueString;
                logger.debug(valueString);
                next();
            } else if (couponValue == "workshop" || couponValue == "Workshop") {
                valueString = "Workshop";
                req.valueString = valueString;
                logger.debug(valueString);
                next();
            }
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
                    res.status(200).json({
                        message: "Coupon gebruikt en ge-update",
                        result: results[0]
                    });
                }
            });  
        });

    },

    workshopCouponHandler(req, res, next) {
        logger.info("workshopCouponHandler called");
        const valueString = req.valueString;
        if (valueString !== "Workshop") {
            next();
        } else {
            const coupon = req.coupon;
            const price = req.price;
            logger.debug("coupon: ", coupon,"Price: ", price);
            


            

            res.status(200).json({
            message: 'Coupon succesfully sent!',
            result: coupon
            });
        }
    },

    moneyCouponHandler(req, res, next) {
        logger.info("moneyCouponHandler called");
        const valueString = req.valueString;
        if (valueString != "Money") {
            next();
        } else {
            const couponCode = req.params.Code

            let getOneResults;
            controller.getOne(couponCode, (results) => {
                logger.debug("results: ", results);
                getOneResults = results[0];
                let Korting = getOneResults.Value

                controller.updateCoupon(couponCode, (results) => {
                })

                res.status(200).json({
                    message: 'Coupon succesfully used!',
                    Korting: Korting
                    });
                
            }

        }
        
    },

    percentageCouponHandler(req, res, next) {
        logger.info("percentageCouponHandler called");
        const valueString = req.valueString;
        if (valueString !== "Percentage") {
            next();
        } else {
            controller.getOne(couponCode, (results) => {
                logger.debug("results: ", results);
                getOneResults = results[0];
                let Korting = getOneResults.Value
                res.status(200).json({
                    message: 'Coupon succesfully used!',
                    Korting: Korting
                    });
                
            }
        }
    },

    percentageMaxCouponHandler(req, res, next) {
        logger.info("percentageMaxCouponHandler called");
        const valueString = req.valueString;
        if (valueString !== "PercentageMax") {
            res.status(400).json({
                message: "Error, invalid coupon type"
            })
        } else {
            const coupon = req.coupon;
            res.status(200).json({
            message: 'Coupon succesfully sent!',
            result: coupon
            });
        }
    }
};

module.exports = controller;
