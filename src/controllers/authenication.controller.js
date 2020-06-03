const assert = require('assert');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const logger = require('../config/config').logger;

module.exports = {
    login(req, res, next) {
        pool.getConnection((err, connection) => {
            if (err) {
                logger.debug('Error getting connection from pool');
                res.status(500).json({
                    error: err.toString(),
                    datetime: new Date().toISOString()
                });
            }
            if (connection) {
                // Check if the acc exists
                connection.query(
                    'SELECT `Naam`, `Email`, `Wachtwoord` , `Gebruiker` as Origin FROM `Gebruiker` UNION SELECT `Naam`, `Email`, `Wachtwoord`, `Admin` as Origin FROM `Admin` WHERE `Email` = ?',
                    [req.body.email],
                    (err, rows, fields) => {
                        connection.release();
                        if (err) {
                            logger.debug('Error: ', err.toString());
                            res.status(500).json({
                                error: err.toString(),
                                datetime: new Date().toISOString()
                            });
                        } else {
                            // Check the Password
                            logger.info('Result from database: ');
                            logger.info(rows);

                            if (rows.length === 0) {
                                logger.info(
                                    'User not found or password is invalid'
                                );
                                res.status(400).json({
                                    error:
                                        'User not found or password is invalid',
                                    datetime: new Date().toISOString()
                                });
                            } else {
                                // Bcrypt unhashing the password
                                bcrypt.compare(
                                    req.body.Wachtwoord,
                                    rows[0].Wachtwoord,
                                    function (err, result) {
                                        if (
                                            rows &&
                                            rows.length === 1 &&
                                            result
                                        ) {
                                            logger.info(
                                                'passwords DID match, sending valid token'
                                            );
                                            const payload = {
                                                email: rows[0].Email,
                                                IsAdmin: 0
                                            };
                                            if (rows[0].Origin === 'Admin') {
                                                payload = {
                                                    email: rows[0].Email,
                                                    IsAdmin: 1
                                                };
                                            }
                                            // Create an object containing the data we want in the payload.

                                            // Userinfo returned to the caller.
                                            //zet secret in eviorment variable
                                            const userinfo = {
                                                token: jwt.sign(
                                                    payload,
                                                    'secret',
                                                    {
                                                        expiresIn: '2h'
                                                    }
                                                ),
                                                Organisatie: rows[0].Organisatie
                                            };
                                            res.status(200).json(userinfo);
                                        }
                                    }
                                );
                            }
                        }
                    }
                );
            }
        });
    },

    validateLogin(req, res, next) {
        // Verify that we receive the expected input
        const { email, password } = req.body;
        try {
            assert(typeof email === 'string', 'email must be a string.');
            assert(typeof password === 'string', 'password must be a string.');
            assert.match(
                req.body.email,
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'e-mail is invalid!'
            );

            assert.match(
                req.body.password,
                /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/,
                'Password must contain at least one letter, at least one number, and be longer than six charaters.'
            );
            next();
        } catch (ex) {
            res.status(400).json({
                error: ex.toString(),
                datetime: new Date().toISOString()
            });
        }
    },

    register(req, res, next) {
        logger.info('register');
        logger.info(req.body);

        //Query the database to see if the email of the user to be registered already exists.
        pool.getConnection((err, connection) => {
            if (err) {
                logger.debug(
                    'Error getting connection from pool: ' + err.toString()
                );
                res.status(500).json({
                    error: err.toString(),
                    datetime: new Date().toISOString()
                });
            }
            if (connection) {
                let { Naam, Email, Organisatie, Adress } = req.body;

                // bcrypt is hashing the password
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.Wachtwoord, salt, function (
                        err,
                        hash
                    ) {
                        logger.debug('password hashed: ', hash);

                        connection.query(
                            'INSERT INTO `Gebruiker` (`Naam`, `Email`, `Organisatie`, `Adress`, `Wachtwoord`) VALUES (?, ?, ?, ?, ?)',
                            [Naam, Email, Organisatie, Adress, hash],
                            (err, rows, fields) => {
                                connection.release();
                                if (err) {
                                    // When the INSERT fails, we assume the user already exists
                                    logger.debug('Error: ' + err.toString());
                                    res.status(400).json({
                                        error: 'Deze e-mail is al in gebruik.',
                                        datetime: new Date().toISOString()
                                    });
                                } else {
                                    logger.trace('succes user added!');

                                    res.status(200).json(
                                        'Succes ' +
                                            Organisatie +
                                            ' is aangemaakt!'
                                    );
                                }
                            }
                        );
                    });
                });
            }
        });
    },

    validateRegister(req, res, next) {
        // Verify that we receive the expected input
        try {
            assert(typeof req.body.Naam === 'string', 'naam must be a string.');
            assert(
                typeof req.body.Organisatie === 'string',
                'lastname must be a string.'
            );
            assert(
                typeof req.body.Email === 'string',
                'email must be a string.'
            );
            assert(
                typeof req.body.Adress === 'string',
                'Adress must be a string.'
            );

            assert.match(
                req.body.Email,
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'e-mail is invalid!'
            );

            assert.match(
                req.body.Wachtwoord,
                /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/,
                'Password must contain at least one letter, at least one number, and be longer than six charaters.'
            );
            assert(
                typeof req.body.Wachtwoord === 'string',
                'password must be a string.'
            );
            next();
        } catch (ex) {
            res.status(400).json({
                error: ex.toString(),
                datetime: new Date().toISOString()
            });
        }
    },

    validateToken(req, res, next) {
        logger.info('validateToken called');
        logger.trace(req.headers);
        // The headers should contain the authorization-field with value 'Bearer [token]'
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({
                error: 'Authorization header missing!',
                datetime: new Date().toISOString()
            });
        } else {
            // Strip the word 'Bearer ' from the headervalue
            const token = authHeader.substring(7, authHeader.length);

            jwt.verify(token, 'secret', (err, payload) => {
                if (err) {
                    logger.warn('Not authorized');
                    res.status(401).json({
                        error: 'Not authorized',
                        datetime: new Date().toISOString()
                    });
                }
                if (payload) {
                    logger.debug('token is valid', payload);
                    // User heeft toegang. Voeg UserId uit payload toe aan
                    // request, voor ieder volgend endpoint.
                    req.userId = payload.id;
                    next();
                }
            });
        }
    },
    validateAdmin(req, res, next) {
        logger.info('validateadmin called');
        logger.trace(req.headers);
        // The headers should contain the authorization-field with value 'Bearer [token]'
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({
                error: 'Authorization header missing!',
                datetime: new Date().toISOString()
            });
        } else {
            // Strip the word 'Bearer ' from the headervalue
            const token = authHeader.substring(7, authHeader.length);

            jwt.verify(token, 'secret', (err, payload) => {
                if (err) {
                    logger.warn('Not authorized');
                    res.status(401).json({
                        error: 'Not authorized',
                        datetime: new Date().toISOString()
                    });
                }
                if (payload) {
                    logger.debug('token is valid', payload);
                    // User heeft toegang. Voeg UserId uit payload toe aan
                    // request, voor ieder volgend endpoint.
                    if (payload.IsAdmin === 1) {
                        next();
                    } else {
                        res.status(401).json({
                            error: 'je hebt geen rechten om dit te doen!',
                            datetime: new Date().toISOString()
                        });
                    }
                }
            });
        }
    }
};
