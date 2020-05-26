const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./src/config/database');

const workshoproutes = require('./src/routes/workshop.routes');

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.all('*', (req, res, next) => {
  const method = req.method;
  const url = req.url;
  console.log(method, 'request on url', url);
  next();
});

// routes
app.use('/api', workshoproutes);

app.all('*', (req, res, next) => {
  res.status(404).json({
    error: 'Endpoint does not exist!'
  });
});

app.listen(port, () =>
  logger.info(`Server listening at http://localhost:${port}`)
);

function gracefulShutdown() {
  logger.info('Server shutting down');
  connection.end(function (err) {
    logger.info('Database pool connections closed');
  });
}

// e.g. kill
process.on('SIGTERM', gracefulShutdown);
// e.g. Ctrl + C
process.on('SIGINT', gracefulShutdown);

module.exports = app;
