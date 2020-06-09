const assert = require('assert');
const connection = require('../config/database.connection');
const logger = require('../config/config').logger;

let controller = {
    validateWorkshop(req, res, next) {
        try {
            const {
                Naam,
                Beschrijving,
                Kosten,
                VervolgKosten,
                Categorie
            } = req.body;
            assert(typeof Naam === 'string', 'Name is missing.');
            assert(typeof Beschrijving === 'string', 'Description is missing.');
            assert(typeof Kosten === 'number', 'Price is missing.');
            assert(
                typeof VervolgKosten === 'number',
                'Follow-up price is missing.'
            );
            assert(typeof Categorie === 'string', 'Categorie is missing.');

            next();
        } catch (err) {
            logger.debug('Error', err);
            res.status(400).json({
                message: 'Error validating workshop!',
                error: err.message
            });
        }
    },

    createWorkshop(req, res, next) {
        logger.info('createworkshop called');
        const workshop = req.body;
        const {
            Naam,
            Beschrijving,
            Kosten,
            VervolgKosten,
            Categorie
        } = workshop;
        console.log('workshop =', workshop);

        let sqlQuery =
            'INSERT INTO `Workshop` (`Naam`, `Beschrijving`, `Kosten`, `VervolgKosten`, `Categorie`) VALUES (?, ?, ?, ?, ?)';
        logger.debug('createWorkshop', 'sqlQuery =', sqlQuery);

        connection.connectDatabase(
            sqlQuery,
            [Naam, Beschrijving, Kosten, VervolgKosten, Categorie],
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
        const workshopName = req.body.workshopNaam;

        let sqlQuery =
            `SELECT Naam FROM Workshop WHERE Naam = '` + workshopName + `'`;
        logger.debug('checkDatabase', 'sqlQuery = ', sqlQuery);

        connection.connectDatabase(sqlQuery, (error, results, fields) => {
            if (error) {
                logger.debug('checkDatabase deleteWorkshop not found');
                res.status(400).json({
                    message: 'Workshop not found'
                });
            } else {
                logger.debug('checkDatabase deleteWorkshop workshop found');
                next();
            }
        });
    },
    // Check of workshop in db staat

    deleteWorkshop(req, res, next) {
        logger.info('deleteWorkshop called');
        const workshopNaam = req.body.workshopNaam;

        let sqlQuery =
            `DELETE FROM Workshop WHERE Naam = '` + workshopNaam + `'`;
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
    },

    getOne(req, res, next) {
        const workshopName = req.params.workshopName;

        const query =
            `SELECT Naam, Beschrijving, Kosten, Vervolg Kosten, Categorie FROM Workshop WHERE Naam = '` +
            workshopName +
            `';`;

        logger.info('getOne:', workshopName);

        connection.connectDatabase(query, (error, results, fields) => {
            if (error) {
                logger.debug(workshopName, query, error);
                res.status(400).json({
                    message: 'workshop does not exist!'
                });
            } else {
                res.status(200).json({
                    User: results[0]
                });
            }
        });
    },

    getAll(req, res, next) {
        const query = `SELECT Naam, Beschrijving, Kosten, VervolgKosten, Categorie FROM Workshop GROUP BY Categorie;`;

        connection.connectDatabase(query, (error, results, fields) => {
            if (error) {
                logger.debug('getAll', query);
                res.status(400).json({
                    error: error
                });
            } else if (results.length == 0) {
                res.status(200).json({
                    message: 'There are no workshops!'
                });
            } else {
                res.status(200).json({
                    Users: results
                });
            }
        });
    },

    updateWorkshop(req, res, next) {
        const workshopName = req.params.workshopName;
        logger.info('updateWorkshop', workshopName);

        let { Naam, Beschrijving, Kosten, VervolgKosten, Categorie } = req.body;
        let query =
            `UPDATE Workshop SET Naam = ?, Besschrijving = ?, Kosten = ?, VervolgKosten = ?, Categorie = ? WHERE name = '` +
            workshopName +
            `';`;

        connection.connectDatabase(
            query,
            [Naam, Beschrijving, Kosten, VervolgKosten, Categorie],
            (error, results, fields) => {
                if (error) {
                    logger.debug(
                        'updateWorkshop:',
                        workshopName,
                        req.body,
                        error
                    );
                    res.status(400).json({
                        message: 'A workshop with this email already exists!',
                        error: error
                    });
                } else {
                    logger.info('Workshop updated:', req.body);
                    res.status(200).json({
                        message: 'Workshop updated!',
                        result: {
                            ...req.body
                        },
                        test: query
                    });
                }
            }
        );
    }
};

module.exports = controller;
