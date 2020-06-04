const pool = require('../config/database');
const config = require('../config/config');

let connection = {
    connectDatabase(query, parameters, callback) {
        pool.getConnection((err, connection) => {
            if (err) {
                // res.status(400).json({
                //     message: 'Database connection failed!',
                //     error: err
                // });
            } else {
                connection.query(
                    query,
                    parameters,
                    (error, results, fields) => {
                        connection.release();
                        callback(error, results);
                    }
                );
            }
        });
    }
};

module.exports = connection;
