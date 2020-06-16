const logger = require('../config/config').logger;
const assert = require('assert');
const connection = require('../config/database.connection');
const bcrypt = require('bcrypt');

let controller = {
    validateUser(req, res, next) {
        let { Naam, Email, Organisatie } = req.body;

        logger.info('validateUser:', req.body);
        try {
            // Missing values giving errors
            assert(typeof Naam === 'string', 'Name is missing!');
            assert(typeof Email === 'string', 'Email is missing!');
            assert(typeof Organisatie === 'string', 'Organisation is missing!');

            // Invalid values giving errors
            assert.match(
                req.body.Email,
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Email is invalid!'
            );

            next();
        } catch (err) {
            logger.debug('Error adding user:', err.message);
            res.status(400).json({
                message: 'Error adding user!',
                error: err.message
            });
        }
    },

    createUser(req, res, next) {
        logger.info('createUser:', req.body);

        let { Naam, Email, Organisatie } = req.body;

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash('Welkom01', salt, function(err, hash) {
                let query = `INSERT INTO Gebruiker (Naam, Email, Organisatie, Wachtwoord) VALUES (?, ?, ?, ?);`;

                connection.connectDatabase(
                    query, [Naam, Email, Organisatie, hash],
                    (error, results, fields) => {
                        if (error) {
                            logger.debug('createUser:', req.body, error);
                            res.status(400).json({
                                message: 'A user with this email already exists! or put in a existing organisation'
                            });
                        } else {
                            logger.info('User added:', req.body);
                            res.status(200).json({
                                message: 'User added!',
                                result: {
                                    ...req.body
                                }
                            });
                        }
                    }
                );
            });
        });
    },

    getOne(req, res, next) {
        const userMail = req.params.userID;

        const query =
            `SELECT Naam, Email, Organisatie, Adress FROM Gebruiker WHERE ID = '` +
            userMail +
            `';`;

        logger.info('getOne:', userMail);

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

    getAll(req, res, next) {
        const query = 'SELECT ID, Naam, Email, Organisatie FROM Gebruiker;';

        connection.connectDatabase(query, (error, results, fields) => {
            if (error) {
                logger.debug('getAll', query);
                res.status(400).json({
                    error: error
                });
            } else if (results.length == 0) {
                res.status(404).json({
                    message: 'There are no users!'
                });
            } else {
                res.status(200).json({
                    Users: results
                });
            }
        });
    },

    checkDatabase(req, res, next) {
        let userID = req.params.Id;

        logger.debug(req.params.Id);
        const query = `SELECT Naam FROM Gebruiker WHERE ID = ?;`;

        connection.connectDatabase(query, userID, (error, results, fields) => {
            if (results.length == 0) {
                logger.debug('checkDatabase:', error);
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
        const userID = req.params.Id;

        const query = `DELETE FROM Gebruiker WHERE ID = ?;`;

        connection.connectDatabase(query, userID, (error, results, fields) => {
            if (error) {
                logger.debug('deleteUser', userID, error);
                res.status(400).json({
                    error: error
                });
            } else {
                logger.info(userID, 'deleted!');
                res.status(200).json({
                    message: 'User deleted!'
                });
            }
        });
    },

    updateUser(req, res, next) {
        const userID = req.params.userID;
        logger.info('updateUser:', userID);

        let { Naam, Email, Organisatie } = req.body;
        let query = `UPDATE Gebruiker SET Naam = ?, Email = ?, Organisatie = ?  WHERE ID = ?;`;

        connection.connectDatabase(
            query, [Naam, Email, Organisatie, userID],
            (error, results, fields) => {
                if (error) {
                    logger.debug('updateUser:', userID, req.body, error);
                    res.status(400).json({
                        message: 'A user with this email already exists!',
                        error: error
                    });
                } else {
                    logger.info('User updated:', req.body);
                    res.status(200).json({
                        message: 'User updated!',
                        result: {
                            ...req.body
                        }
                    });
                }
            }
        );
    },

    uploadImage(req, res, next) {
        const { userID, Path } = req.body;

        logger.info('uploadImage', req.body);

        let query = 'UPDATE Gebruiker SET Path = ? WHERE ID = ?;';

        connection.connectDatabase(
            query, [Path, userID],
            (error, results, fields) => {
                if (error) {
                    logger.debug('uploadImage', userID, Path);
                    res.status(400).json({
                        error: error
                    });
                } else {
                    logger.info('Image uploaded for:', userID, 'on', Path);
                    res.status(200).json({
                        message: 'Image uploaded!'
                    });
                }
            }
        );
    }
};

module.exports = controller;