const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./src/config/database');
const logger = require('./src/config/config').logger;
const multer = require('multer');
var forms = multer();

const authenticationRoutes = require('./src/routes/authentication.routes');
const userroutes = require('./src/routes/user.route');
const workshoproutes = require('./src/routes/workshop.routes');
const couponroutes = require('./src/routes/coupon.route');
const invoiceroutes = require('./src/routes/invoice.route');

const app = express();

app.use(bodyParser.json());
app.use(forms.array());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

// Add CORS headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
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

app.use((req, res, next) => {
    logger.info(req.method, req.originalUrl, req.params, req.query);
    next();
});

// Url redirect
app.get('/', function (request, response) {
    response.sendFile(__dirname + '/frontend/login/index.html');
});

// // Serve files from the ./frontend folder
app.use('/', express.static(__dirname + '/frontend'));
app.use('/', express.static(__dirname + '/frontend/login'));
app.use('/', express.static(__dirname + '/frontend/dashboardBeheer'));
app.use('/', express.static(__dirname + '/frontend/dashboardGebruiker'));
app.use('/', express.static(__dirname + '/frontend/opmaak'));
app.use('/', express.static(__dirname + '/frontend/scripts'));

// Routes
app.use('/api', authenticationRoutes);
app.use('/api/user', userroutes);
app.use('/api/workshop', workshoproutes);
app.use('/api/invoice', invoiceroutes);

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
