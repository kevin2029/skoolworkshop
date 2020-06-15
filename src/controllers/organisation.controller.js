const assert = require('assert');
const connection = require('../config/database.connection');
const logger = require('../config/config').logger;

let controller = {
    validateOrganisation(req, res, next) {
        try {
            const { Naam, Adres } = req.body;
            assert(typeof Naam === 'string', 'Name is missing.');
            assert(typeof Adres === 'string', 'Adres is missing.');
            next();
        } catch (err) {
            logger.debug('Error', err);
            res.status(400).json({
                message: 'Error validating Organisation!',
                error: err.message
            });
        }
    },

    createOrganisation(req, res, next) {
        logger.info('Organisation called');
        const Organisation = req.body;
        const { Naam, Adres } = Organisation;
        console.log('Organisation =', Organisation);

        let sqlQuery =
            'INSERT INTO `Organisatie` (`Naam`, `Adres`) VALUES (?, ?)';
        logger.debug('createOrganisation', 'sqlQuery =', sqlQuery);

        connection.connectDatabase(sqlQuery, [Naam, Adres], (error, results, fields) => {
                logger.debug('connectDatabase called');
                if (error) {
                    logger.debug('createOrganisation', error);
                    res.status(400).json({
                        message: 'Organisation already exists!'
                    });
                }
                if (results) {
                    logger.debug('results: ', results);
                    res.status(200).json({
                        message: 'Organisation added!',
                        result: {
                            ...Organisation
                        }
                    });
                }
            }
        );
    },

    deleteOrganisation(req, res, next) {
        logger.info('deleteOrganisation called');
        const OrganisationNaam = req.params.Naam;

        let sqlQuery =
            `DELETE FROM Organisatie WHERE Naam = '` + OrganisationNaam + `'`;
        logger.debug('deleteOrganisatie', 'sqlQuery =', sqlQuery);

        connection.connectDatabase(sqlQuery, (error, results, fields) => {
            if (error) {
                console.log('deleteOrganisation', error);
                res.status(400).json({
                    message: 'delete failed',
                    error: error
                });
            } else {
                logger.debug(results.affectedRows === 0);
                if (results.affectedRows === 0) {
                    res.status(400).json({
                        message: 'delete failed'
                    });
                } else {
                    res.status(200).json({
                        message: 'Organisation succesfully deleted!'
                    });
                }
            }
        });
    },

    getAll(req, res, next) {
        let query = 'SELECT Naam, Adres FROM Organisatie ORDER BY Naam;';

        logger.debug('sql query: ', query);
        connection.connectDatabase(query, (error, results, fields) => {
            if (error) {
                logger.debug('getAll', query);
                res.status(400).json({
                    error: error
                });
            } else if (results.length == 0) {
                res.status(200).json({
                    message: 'There are no organisations!'
                });
            } else {
                res.status(200).json({
                    result: results
                });
            }
        });
    }
};

module.exports = controller;
