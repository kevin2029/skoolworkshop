const assert = require('assert');
const connection = require('../config/database.connection');

let controller = {
    validateUser(req, res, next) {
        let { Name, Email, Organisation, Address, Password } = req.body;

        try {
            // Missing values giving errors
            assert(typeof Name === 'string', 'Name is missing!');
            assert(typeof Email === 'string', 'Email is missing!');
            assert(
                typeof Organisation === 'string',
                'Organisation is missing!'
            );
            assert(typeof Address === 'string', 'Address is missing!');
            assert(typeof Password === 'string', 'Password is missing!');

            // Invalid values giving errors
            assert.match(
                req.body.Email,
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Email is invalid!'
            );

            next();
        } catch (err) {
            res.status(400).json({
                message: 'Error adding user!',
                error: err.message
            });
        }
    },

    createUser(req, res, next) {
        console.log('user: ', req.body);
        let user = req.body;

        console.log('user =', user);

        let { Name, Email, Organisation, Address, Password } = user;
        let query =
            'INSERT INTO `gebruiker` (`Naam`, `Email`, `Organisatie`, `Adress`, `Wachtwoord`) VALUES (?, ?, ?, ?, ?) ';
        console.log('createUser query:', query);

        connection.connectDatabase(
            query,
            [Name, Email, Organisation, Address, Password],
            (error, results) => {
                if (error) {
                    console.log('createUser', error);
                    res.status(400).json({
                        message: 'User already exists!',
                        error: error
                    });
                } else {
                    console.log('results', results);
                    res.status(200).json({
                        result: {
                            ...user
                        }
                    });
                }
            }
        );
    }
};

module.exports = controller;
