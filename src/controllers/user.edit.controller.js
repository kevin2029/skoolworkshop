const assert = require('assert');
const connection = require('../config/database.connection');
const logger = require('../config/config').logger;
const bcrypt = require('bcrypt');
const { exit } = require('process');

let controller = {
    validateEdit(req, res, next) {
        let { Naam, Wachtwoord, WachtwoordHerhaal, Email } = req.body;
        let ID = req.params.userID;
        logger.debug('ID: ', ID);

        let edits = 0;

        if (typeof Naam === 'string') {
            edits++;
        }

        if (typeof Wachtwoord === 'string') {
            edits++;

            if (!typeof WachtwoordHerhaal === 'string') {
                res.status(400).json({
                    message: 'WachtwoordHerhaal was not passed',
                    error: err.message
                });
                return;
            }

            if (Wachtwoord !== WachtwoordHerhaal) {
                res.status(400).json({
                    message: 'Wachtwoorden komen niet overheen',
                    error: err.message
                });
                return;
            }
        }

        if (typeof Email === 'string') {
            edits++;
        }

        logger.info('validateUserEdit:', req.body);
        try {
            // Missing values giving errors
            assert(typeof ID === 'string', 'Id is missing!');
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
        let { Naam, Wachtwoord, WachtwoordHerhaal, Email } = req.body;
        let ID = req.params.userID;
        logger.debug('ID: ', ID);

        let query = 'UPDATE `Gebruiker` SET';
        let values = [];

        if (typeof Naam === 'string') {
            query += ' `Naam` = ?';
            values.push(Naam);
        }

        if (typeof Email === 'string') {
            query += ' `Email` = ?';
            values.push(Email);
        }

        if (typeof Wachtwoord === 'string') {
            query += ' `Wachtwoord` = ?';

            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.Wachtwoord, salt, function (err, hash) {
                    values.push(hash);

                    query += ' WHERE `ID` = ?';
                    values.push(ID);

                    doEdit(req, res, query, values);
                });
            });
        } else {
            query += ' WHERE `ID` = ?';
            values.push(ID);

            doEdit(req, res, query, values);
        }
    }
};

function doEdit(req, res, query, values) {
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

module.exports = controller;
