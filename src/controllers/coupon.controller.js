const logger = require('../config/config').logger;
const assert = require('assert');
const connection = require('../config/database.connection');

let controller = {
    validateWorkshop(req, res, next) {
        try {
            const {
                naam,
                beschrijving,
                kosten,
                vervolgKosten,
                genre
            } = req.body;
            assert(typeof naam === 'string', 'Name is missing.');
            assert(typeof beschrijving === 'string', 'Description is missing.');
            assert(typeof kosten === 'number', 'Price is missing.');
            assert(
                typeof vervolgKosten === 'number',
                'Follow-up price is missing.'
            );
            assert(typeof genre === 'string', 'Genre is missing.');

            next();
        } catch (err) {
            res.status(400).json({
                message: 'Error adding workshop!',
                error: err.message
            });
        }
    },

    createWorkshop(req, res, next) {
        // logger.info('createworkshop called');
        const workshop = req.body;
        let { naam, beschrijving, kosten, vervolgKosten, genre } = workshop;
        console.log('workshop =', workshop);

        let sqlQuery =
            'INSERT INTO `Workshop` (`Naam`, `Beschrijving`, `Kosten`, `Vervolg Kosten`, `genre`) VALUES (?, ?, ?, ?, ?)';
        // logger.debug('createWorkshop', 'sqlQuery =', sqlQuery);

        connection.connectDatabase(
            sqlQuery,
            [naam, beschrijving, kosten, vervolgKosten, genre],
            (error, results, fields) => {
                if (error) {
                    console.log('createWorkshop', error);
                    res.status(400).json({
                        message: 'Workshop already exists!'
                    });
                }
                if (results) {
                    console.log('results: ', results);
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
        // logger.debug('checkDatabase', 'sqlQuery = ', sqlQuery);

        connection.connectDatabase(sqlQuery, (error, results, fields) => {
            if (error) {
                // logger
                res.status(400).json({
                    message: 'Workshop not found'
                });
            } else {
                // logger workshop found
                next();
            }
        });
    },
    // Check of workshop in db staat

    deleteWorkshop(req, res, next) {
        // logger.info('deleteWorkshop called');
        const workshopName = req.params.workshopNaam;

        let sqlQuery =
            `DELETE FROM Workshop WHERE Naam = '` + workshopName + `'`;
        // logger.debug('deleteWorkshop', 'sqlQuery =', sqlQuery);

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