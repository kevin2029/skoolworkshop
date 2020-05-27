const connection = require('../config/database');
const config = require('../config/config');
const logger = config.logger;

let connection = {
    connectDatabase(query, parameters, callback) {
        connection.getConnection((err, connection) => {
            if (err) {
                res.status(400).json({
                    message: 'Database connection failed!',
                    error: err
                });
            }
            connection.query(query, parameters, (error, results, fields) => {
                connection.release();
                logger.debug('Releasing connection');
                callback(error, results);
            });
        });
    }
};

module.exports = connection;
