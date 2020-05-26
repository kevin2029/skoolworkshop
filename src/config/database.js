const mysql = require('mysql');
const logger = require('./config').logger;
const dbconfig = require('./config').dbconfig;

const connection = mysql.createPool(dbconfig);

connection.on('connection', function (connection) {
  logger.trace('Database connection established');
});

connection.on('acquire', function (connection) {
  logger.trace('Database connection aquired');
});

connection.on('release', function (connection) {
  logger.trace('Database connection released');
});

module.exports = connection;
