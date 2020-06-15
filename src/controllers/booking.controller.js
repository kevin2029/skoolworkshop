const logger = require('../config/config').logger;
const assert = require('assert');
const connection = require('../config/database.connection');

let controller = {
    validateBooking(req, res, next) {
        logger.info('validateBooking called', req.body);
        try {
            const {
                WorkshopName,
                BookedData
            } = req.body;
            assert(typeof WorkshopName === 'string', 'WorkshopName is missing.');
            assert(typeof BookedData === 'string', 'BookedDate is missing.');

            next();
        } catch (err) {
            logger.debug('Error', err);
            res.status(400).json({
                message: 'Error whilst Booking!',
                error: err.message
            });
        }
    },

    createBooking(req, res, next) {
        logger.info('createcoupon called');
        const ID = req.params.ID;
        const booking = req.body;
        let {
            WorkshopName,
            BookedData,
            Korting
        } = booking;
        logger.debug('booking =', booking);

        let sqlQuery =
            'INSERT INTO `GebruikerWorkshop` (`GebruikerID`, `Workshopnaam`, `SingedUpOn`, `BookedDate`, `Korting`) VALUES (?, ?, CURDATE(), ?, ?)';
        logger.debug('createbooking', 'sqlQuery =', sqlQuery);

        connection.connectDatabase(
            sqlQuery, [
                ID,
                WorkshopName,
                BookedData,
                Korting
            ],
            (error, results, fields) => {
                if (error) {
                    logger.debug('createbooking', error);
                    res.status(400).json({
                        message: 'Booking already exists!',
                        error: error
                    });
                }
                if (results) {
                    logger.debug('results: ', results);
                    res.status(200).json({
                        result: {
                            ...booking
                        }
                    });
                }
            }
        );
    },
}

module.exports = controller;