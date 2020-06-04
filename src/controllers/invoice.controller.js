const logger = require('../config/config').logger;
const assert = require('assert');
const connection = require('../config/database.connection');

let controller = {
    valIDateInvoice(req, res, next) {
        let { GebruikerMail, Path, IsBetaald } = req.body;

        logger.info('valIDateInvoice:', req.body);
        try {
            // Missing values giving errors
            assert(typeof GebruikerMail === 'string', 'Name is missing!');
            assert(typeof Path === 'string', 'Email is missing!');
            assert(typeof IsBetaald === 'string', 'Organisation is missing!');

            // InvalID values giving errors
            assert.match(
                req.body.GebruikerMail,
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Email is invalID!'
            );

            next();
        } catch (err) {
            logger.debug('Error adding invoice:', err.message);
            res.status(400).json({
                message: 'Error adding invoice!',
                error: err.message
            });
        }
    },

    createInvoice(req, res, next) {
        logger.info('createInvoice:', req.body);

        let { GebruikerMail, Path, IsBetaald } = req.body;
        let query =
            'INSERT INTO Factuur (GebruikerMail, Path, IsBetaald) VALUES (?, ?, ?);';

        connection.connectDatabase(
            query,
            [GebruikerMail, Path, IsBetaald],
            (error, results, fields) => {
                if (error) {
                    logger.debug('createInvoice:', req.body, error);
                    res.status(400).json({
                        error: error
                    });
                } else {
                    logger.info('Invoice added:', req.body);
                    res.status(200).json({
                        message: 'Invoice added!',
                        result: {
                            ...req.body
                        }
                    });
                }
            }
        );
    },

    getOne(req, res, next) {
        const ID = req.params.ID;

        const query =
            `SELECT GebruikerMail, Path, IsBetaald FROM Factuur WHERE ID = '` +
            ID +
            `';`;

        logger.info('invoice getOne:', ID);

        connection.connectDatabase(query, (error, results, fields) => {
            if (error) {
                logger.debug(ID, query, error);
                res.status(400).json({
                    message: 'Invoice does not exist!'
                });
            } else {
                res.status(200).json({
                    User: results[0]
                });
            }
        });
    },

    getAll(req, res, next) {
        const query = 'SELECT GebruikerMail, Path, IsBetaald FROM Invoice;';

        connection.connectDatabase(query, (error, results, fields) => {
            if (error) {
                logger.debug('invoice getAll', query);
                res.status(400).json({
                    error: error
                });
            } else if (results.length == 0) {
                res.status(200).json({
                    message: 'There are no invoices!'
                });
            } else {
                res.status(200).json({
                    Users: results
                });
            }
        });
    },

    checkDatabase(req, res, next) {
        const ID = req.params.ID;

        const query = `SELECT ID FROM Factuur WHERE ID = '` + ID + `';`;

        connection.connectDatabase(query, (error, results, fields) => {
            if (results.length == 0) {
                logger.debug('invoice checkDatabase:', error);
                res.status(400).json({
                    message: 'User not found!'
                });
            } else {
                logger.debug('User found, continuing!');
                next();
            }
        });
    },

    deleteUser(req, res, next) {
        const ID = req.params.ID;

        const query = `DELETE FROM Gebruiker WHERE Email = '` + ID + `';`;

        connection.connectDatabase(query, (error, results, fields) => {
            if (error) {
                logger.debug('deleteUser', ID, error);
                res.status(400).json({
                    error: error
                });
            } else {
                logger.info(ID, 'deleted!');
                res.status(200).json({
                    message: 'User deleted!'
                });
            }
        });
    },

    validateUpdateInvoice(req, res, next) {
        let { Naam, Email, Organisatie, Adress } = req.body;

        logger.info('valIDateUpdateUser:', req.body);
        try {
            // Missing values giving errors
            assert(typeof Naam === 'string', 'Name is missing!');
            assert(typeof Email === 'string', 'Email is missing!');
            assert(typeof Organisatie === 'string', 'Organisation is missing!');
            assert(typeof Adress === 'string', 'Address is missing!');

            // InvalID values giving errors
            assert.match(
                req.body.Email,
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Email is invalID!'
            );

            next();
        } catch (err) {
            logger.debug('Error updating user:', err.message);
            res.status(400).json({
                message: 'Error updating user!',
                error: err.message
            });
        }
    },

    updateUser(req, res, next) {
        const ID = req.params.ID;
        logger.info('updateUser:', ID);

        let { Naam, Email, Organisatie, Adress } = req.body;
        let query =
            `UPDATE gebruiker SET Naam = ?, Email = ?, Organisatie = ?, Adress = ? WHERE Email = '` +
            ID +
            `';`;

        connection.connectDatabase(
            query,
            [Naam, Email, Organisatie, Adress],
            (error, results, fields) => {
                if (error) {
                    logger.debug('updateUser:', ID, req.body, error);
                    res.status(400).json({
                        error: error
                    });
                } else {
                    logger.info('User updated:', req.body);
                    res.status(200).json({
                        message: 'User updated!',
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
