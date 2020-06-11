const assert = require('assert');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const logger = require('../config/config').logger;
const path = require('path');

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
                    "SELECT ID, Email, Wachtwoord, 'GebruikerTable' as Origin FROM Gebruiker WHERE Email = ? UNION SELECT ID, Email, Wachtwoord, 'AdminTable' as Origin FROM Admin WHERE Email = ?",
                    [req.body.Email, req.body.Email],
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
                                console.log(
                                    req.body.Wachtwoord,
                                    rows[0].Wachtwoord
                                );
                                bcrypt.compare(
                                    req.body.Wachtwoord,
                                    rows[0].Wachtwoord,

                                    function (err, result) {
                                        if (result == false) {
                                            res.status(400).json({
                                                error:
                                                    'User not found or password is invalid',
                                                datetime: new Date().toISOString()
                                            });
                                        }
                                        if (
                                            rows &&
                                            rows.length === 1 &&
                                            result
                                        ) {
                                            logger.info(
                                                'passwords DID match, sending valid token'
                                            );
                                            let payload = {
                                                ID: rows[0].ID,
                                                IsAdmin: 0
                                            };
                                            if (
                                                rows[0].Origin === 'AdminTable'
                                            ) {
                                                payload = {
                                                    ID: rows[0].ID,
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
                                                Organisatie:
                                                    rows[0].Organisatie,
                                                payload: payload
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

        logger.debug(req.body);
        const { Email, Wachtwoord } = req.body;
        try {
            assert(typeof Email === 'string', 'email must be a string.');
            assert(
                typeof Wachtwoord === 'string',
                'password must be a string.'
            );
            assert(
                req.body.Email.match(
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ),
                'e-mail is invalid!'
            );

            assert(
                req.body.Wachtwoord.match(
                    /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/
                ),
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

        let sqlQuery = '';
        let parameter = '';

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
                connection.query(
                    "SELECT Email, Wachtwoord, 'GebruikerTable' as Origin FROM Gebruiker WHERE Email = ? UNION SELECT Email, Wachtwoord, 'AdminTable' as Origin FROM Admin WHERE Email = ?",
                    [req.body.Email, req.body.Email],
                    (err, rows, fields) => {
                        if (err) {
                            logger.debug('Error: ', err.toString());
                            res.status(500).json({
                                error: err.toString(),
                                datetime: new Date().toISOString()
                            });
                        }
                        if (rows.length !== 0) {
                            res.status(400).json({
                                error: 'Deze e-mail is al in gebruik.',
                                datetime: new Date().toISOString()
                            });
                        } else {
                            // bcrypt is hashing the password
                            bcrypt.genSalt(10, function (err, salt) {
                                bcrypt.hash(
                                    req.body.Wachtwoord,
                                    salt,
                                    function (err, hash) {
                                        logger.debug('password hashed: ', hash);

                                        if (req.url !== '/register/admin') {
                                            sqlQuery =
                                                'INSERT INTO `Gebruiker` (`Naam`, `Email`, `Organisatie`, `Adress`, `Wachtwoord`) VALUES (?, ?, ?, ?, ?)';
                                            parameter = [
                                                req.body.Naam,
                                                req.body.Email,
                                                req.body.Organisatie,
                                                req.body.Adress,
                                                hash
                                            ];

                                            console.log(
                                                'gebruiker aanmaken',
                                                sqlQuery,
                                                parameter
                                            );
                                        } else {
                                            sqlQuery =
                                                'INSERT INTO `admin` (`Naam`, `Email`, `Wachtwoord`) VALUES (?, ?, ?)';
                                            parameter = [
                                                req.body.Naam,
                                                req.body.Email,
                                                hash
                                            ];
                                            console.log(
                                                'admin aanmaken',
                                                sqlQuery,
                                                parameter
                                            );
                                        }
                                        connection.query(
                                            sqlQuery,
                                            parameter,
                                            (err, rows, fields) => {
                                                connection.release();
                                                if (err) {
                                                    // When the INSERT fails, we assume the user already exists
                                                    logger.debug(
                                                        'Error: ' +
                                                            err.toString()
                                                    );
                                                    res.status(400).json({
                                                        error:
                                                            'Registreren mislukt!',
                                                        datetime: new Date().toISOString()
                                                    });
                                                } else {
                                                    logger.trace(
                                                        'succes user added!'
                                                    );

                                                    res.status(200).json({
                                                        message:
                                                            'Succes ' +
                                                            req.body.Naam +
                                                            ' is aangemaakt!'
                                                    });
                                                }
                                            }
                                        );
                                    }
                                );
                            });
                        }
                    }
                );
            }
        });
    },

    validateRegister(req, res, next) {
        // Verify that we receive the expected input
        try {
            assert(typeof req.body.Naam === 'string', 'naam must be a string.');

            console.log(req.url);
            if (req.url !== '/register/admin') {
                assert(
                    typeof req.body.Organisatie === 'string',
                    'lastname must be a string.'
                );
                assert(
                    typeof req.body.Adress === 'string',
                    'Adress must be a string.'
                );
            }

            assert(
                typeof req.body.Email === 'string',
                'email must be a string.'
            );

            assert(
                req.body.Email.match(
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ),
                'e-mail is invalid!'
            );

            assert(
                req.body.Wachtwoord.match(
                    /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/
                ),
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
                    req.email = payload.email;
                    next();
                }
            });
        }
    },
    validateAdmin(req, res, next) {
        logger.info('validateadmin called');
        logger.debug(req.headers);
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
                        req.email = payload.email;
                        next();
                    } else {
                        res.status(401).json({
                            error: 'Je hebt geen rechten om dit te doen!',
                            datetime: new Date().toISOString()
                        });
                    }
                }
            });
        }
    }
};
