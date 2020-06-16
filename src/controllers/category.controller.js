const logger = require('../config/config').logger;
const assert = require('assert');
const connection = require('../config/database.connection');

let controller = {
    getAll(req, res, next) {
        const query = 'SELECT * FROM Categorie;';

        connection.connectDatabase(query, (error, results, fields) => {
            if (error) {
                logger.debug('getAll', query);
                res.status(400).json({
                    error: error
                });
            } else if (results.length == 0) {
                res.status(404).json({
                    message: 'There are no categoeries!'
                });
            } else {
                res.status(200).json({
                    Result: results
                });
            }
        });
    }
};

module.exports = controller;