const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./src/config/database');
const multer = require('multer');
var forms = multer();

const userroutes = require('./src/routes/user.route');
const workshoproutes = require('./src/routes/workshop.routes');
const couponroutes = require('./src/routes/coupon.route');

const app = express();

app.use(bodyParser.json());
app.use(forms.array());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.all('*', (req, res, next) => {
    const method = req.method;
    const url = req.url;
    console.log(method, 'request on url', url);
    next();
});

// routes
app.use('/api', userroutes);
app.use('/api', workshoproutes);
app.use('/api', couponroutes);

// Add CORS headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); //Adres van server
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type'
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.all('*', (req, res, next) => {
    res.status(404).json({
        error: 'Endpoint does not exist!'
    });
});

app.listen(port, () =>
    console.log(`Server listening at http://localhost:${port}`)
);

function gracefulShutdown() {
    console.log('Server shutting down');
    pool.end(function (err) {
        console.log('Database pool pools closed');
    });
}

// e.g. kill
process.on('SIGTERM', gracefulShutdown);
// e.g. Ctrl + C
process.on('SIGINT', gracefulShutdown);

module.exports = app;
