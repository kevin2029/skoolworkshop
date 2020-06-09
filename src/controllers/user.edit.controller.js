const assert = require('assert');
const connection = require('../config/database.connection');
const logger = require('../config/config').logger;
const bcrypt = require('bcrypt');

let controller = {
    validateEdit(req, res, next) {
        let { Naam, Organisatie, Adress, Wachtwoord } = req.body;
        let Email = req.email;

        let edits = 0;

        if (typeof Naam === 'string') {
            edits++;
        }

        if (typeof Organisatie === 'string') {
            edits++;
        }

        if (typeof Adress === 'string') {
            edits++;
        }

        if (typeof Wachtwoord === 'string') {
            edits++;
        }

        logger.info('validateUserEdit:', req.body);
        try {
            // Missing values giving errors
            assert(typeof Email === 'string', 'Email is missing!');
            assert(edits > 0, 'No edits were passed!');

            next();
        } catch (err) {
            logger.debug('Error editing user:', err.message);
            res.status(400).json({
                message: 'Error editing user!',
                error: err.message
            });
        }
    },

    editUser(req, res, next) {
        let { Naam, Organisatie, Adress, Wachtwoord } = req.body;
        let Email = req.email;

        let query = 'UPDATE `Gebruiker` SET';
        let values = [];

        if (typeof Naam === 'string') {
            query += ' `Naam` = ?';
            values.push(Naam);
        }

        if (typeof Organisatie === 'string') {
            query += ' `Organisatie` = ?';
            values.push(Organisatie);
        }

        if (typeof Adress === 'string') {
            query += ' `Adress` = ?';
            values.push(Adress);
        }

        if (typeof Wachtwoord === 'string') {
            query += ' `Wachtwoord` = ?';
            values.push(Wachtwoord);

            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.Wachtwoord, salt, function (err, hash) {
                 // vanaf hier pas connectie doen tenzij er geen wachtwoord meegegeven is???
                });
            });
        }

        query += ' WHERE `Email` = ?';
        values.push(Email);

        connection.connectDatabase(query, values, (error, results, fields) => {
            if (error) {
                logger.debug('editUser:', req.body, error);
                res.status(400).json({
                    message: 'Could not edit user!',
                    error: error
                });
            } else if (results.affectedRows == 0) {
                logger.debug('editUser: email not in use');
                res.status(400).json({
                    message: 'No user with that email exists!'
                });
            } else {
                logger.info('User edited:', req.body);
                res.status(200).json({
                    message: `User edited with ${results.changedRows} changes`,
                    result: {
                        ...req.body
                    }
                });
            }
        });
    }
};

module.exports = controller;
