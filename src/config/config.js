const loglevel = process.env.LOGLEVEL || 'debug';

module.exports = {
    dbconfig: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'skoolworkshop_admin',
        database: process.env.DB_DATABASE || 'skoolworkshop',
        password: process.env.DB_PASSWORD || 'secret',
        connectionLimit: 10
    },

    logger: require('tracer').console({
        format: ['{{timestamp}} [{{title}}] {{file}}:{{line}} : {{message}}'],
        preprocess: function (data) {
            data.title = data.title.toUpperCase();
        },
        dateformat: 'isoUtcDateTime',
        level: loglevel
    })
};
