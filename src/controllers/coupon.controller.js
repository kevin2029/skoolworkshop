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

    getOne(req, res, next) {
        logger.info("getOne called");
        const couponCode = req.params.Code;

        const query =
            `SELECT Code, Value, MaxBedrag, MaxGebruik, AantalGebruikt, Organisatie FROM Cadeaubon WHERE Code = '` +
            couponCode +
            `';`;

        logger.info('getOne:', couponCode);

        connection.connectDatabase(query, (error, results, fields) => {
            if (error) {
                logger.debug(userMail, query, error);
                res.status(400).json({
                    message: 'User does not exist!'
                });
            } else {
                res.status(200).json({
                    User: results[0]
                });
            }
        });
    },

    useCoupon(req, res, next) {
        logger.info("useCoupon called");
        const couponCode = req.params.Code;

        switch (couponCode){
            case x:
        }

    },

    updateCoupon(req, res, next) {
        logger.info("updateCoupon called");
        const couponCode = req.body.Code;
    },

    workshopCouponHandler(req, res, next) {

    },

    updateCoupon(req, res, next) {
        logger.info("updateCoupon called");
        const couponCode = req.body.Code;
    },

    workshopCouponHandler(req, res, next) {

    }

};

module.exports = controller;