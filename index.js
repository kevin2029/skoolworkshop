const express = require('express');
const bodyParser = require('body-parser');

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

app.all('*', (req, res, next) => {
  res.status(404).json({
    error: 'Endpoint does not exist!'
  });
});

app.all('*', (req, res, next) => {
  res.status(404).json({
    error: 'Endpoint does not exist!'
  });
});
