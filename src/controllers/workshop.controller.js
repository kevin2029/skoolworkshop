const assert = require('assert');
const connection = require('../config/database.connection');
const logger = require('../config/config').logger;

let controller = {
    validateWorkshop(req, res, next) {
        try {
            const {
                naamWorkshop,
                beschrijving,
                kosten,
                vervolgKosten,
                categorie
            } = req.body;
            assert(typeof naamWorkshop === 'string', 'Name is missing.');
            assert(typeof beschrijving === 'string', 'Description is missing.');
            assert(typeof kosten === 'string', 'Price is missing.');
            assert(
                typeof vervolgKosten === 'string',+
                'Follow-up price is missing.'
            );
            assert(typeof categorie === 'string', 'categorie is missing.');

            next();
        } catch (err) {
            logger.debug('Error', err);
            res.status(400).json({
                message: 'Error adding workshop!',
                error: err.message
            });
        }
    },

    createWorkshop(req, res, next) {
        logger.info('createworkshop called');
        const workshop = req.body;
        let { naamWorkshop, beschrijving, kosten, vervolgKosten, categorie } = workshop;
        logger.debug('workshop =', workshop);

        let sqlQuery =
            'INSERT INTO `Workshop` (`Naam`, `Beschrijving`, `Kosten`, `Vervolg Kosten`, `categorie`) VALUES (?, ?, ?, ?, ?)';
        logger.debug('createWorkshop', 'sqlQuery =', sqlQuery);

        connection.connectDatabase(
            sqlQuery,
            [naamWorkshop, beschrijving, kosten, vervolgKosten, categorie],
            (error, results, fields) => {
                logger.debug('connectDatabase called');
                if (error) {
                    logger.debug('createWorkshop', error);
                    res.status(400).json({
                        message: 'Workshop already exists!'
                    });
                }
                if (results) {
                    logger.debug('results: ', results);
                    res.status(200).json({
                        result: {
                            ...workshop
                        }
                    });
                }
            }
        );
    },

    checkDatabase(req, res, next) {
        const workshopName = req.params.workshopNaam;

        let sqlQuery =
            `SELECT Naam FROM Workshop WHERE Naam = '` + workshopName + `'`;
        logger.debug('checkDatabase', 'sqlQuery = ', sqlQuery);

        connection.connectDatabase(sqlQuery, (error, results, fields) => {
            if (error) {
                logger.debug("Workshop not found")
                res.status(400).json({
                    message: 'Workshop not found'
                });
            } else {
                logger.debug("Workshop found")
                next();
            }
        });
    },
    // Check of workshop in db staat

    deleteWorkshop(req, res, next) {
        logger.info('deleteWorkshop called');
        const workshopName = req.params.workshopNaam;

        let sqlQuery =
            `DELETE FROM Workshop WHERE Naam = '` + workshopName + `'`;
        logger.debug('deleteWorkshop', 'sqlQuery =', sqlQuery);

        connection.connectDatabase(sqlQuery, (error, results, fields) => {
            if (error) {
                console.log('deleteWorkshop', error);
                res.status(400).json({
                    message: 'deleteWorkshop failed',
                    error: error
                });
            } else {
                res.status(200).json({
                    message: 'Workshop succesfully deleted!'
                });
            }
        });
    }
};

module.exports = controller;
