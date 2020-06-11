const logger = require('../config/config').logger;
const assert = require('assert');
const connection = require('../config/database.connection');

let controller = {
    validateInvoice(req, res, next) {
        let { GebruikerMail, Path, IsBetaald } = req.body;

        logger.info('validateInvoice:', req.body);
        try {
            // Missing values giving errors
            assert(typeof GebruikerMail === 'string', 'Email is missing!');
            assert(typeof Path === 'string', 'Path is missing!');
            assert(typeof IsBetaald === 'string', 'IsBetaald is missing!');

            // InvalID values giving errors
            assert(req.body.GebruikerMail.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
                'Email is invalid!'
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
            'INSERT INTO Factuur (GebruikerEmail, Path, IsBetaald) VALUES (?, ?, ?);';

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
                    Invoice: results[0]
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
                    Invoices: results
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
                    message: 'Invoice not found!'
                });
            } else {
                logger.debug('Invoice found, continuing!');
                next();
            }
        });
    },

    deleteInvoice(req, res, next) {
        const ID = req.params.ID;

        const query = `DELETE FROM Factuur WHERE ID = '` + ID + `';`;

        connection.connectDatabase(query, (error, results, fields) => {
            if (error) {
                logger.debug('deleteInvoice', ID, error);
                res.status(400).json({
                    error: error
                });
            } else {
                logger.info(ID, 'Invoice deleted!');
                res.status(200).json({
                    message: 'Invoice deleted!'
                });
            }
        });
    },

    validateUpdateInvoice(req, res, next) {
        let { GebruikerMail, Path, IsBetaald } = req.body;

        logger.info('validateUpdateInvoice:', req.body);
        try {
            // Missing values giving errors
            assert(
                typeof GebruikerMail === 'string',
                'Email needs to be a string!'
            );
            assert(typeof Path === 'string', 'Path needs to be a string!');
            assert(
                typeof IsBetaald === 'boolean',
                'IsBetaald needs to be a string!'
            );

            // InvalID values giving errors
            assert.match(
                req.body.Email,
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Email is invalid!'
            );

            next();
        } catch (err) {
            logger.debug('Error updating invoice:', err.message);
            res.status(400).json({
                message: 'Error updating invoice!',
                error: err.message
            });
        }
    },

    updateInvoice(req, res, next) {
        const ID = req.params.ID;
        logger.info('updateInvoice:', ID);

        let { GebruikerMail, Path, IsBetaald } = req.body;
        let query =
            `UPDATE Factuur SET GebruikerMail = ?, Path = ?, IsBetaald = ? WHERE Email = '` +
            ID +
            `';`;

        connection.connectDatabase(
            query,
            [GebruikerMail, Path, IsBetaald],
            (error, results, fields) => {
                if (error) {
                    logger.debug('updateInvoice:', ID, req.body, error);
                    res.status(400).json({
                        error: error
                    });
                } else {
                    logger.info('Invoice updated:', req.body);
                    res.status(200).json({
                        message: 'Invoice updated!',
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
