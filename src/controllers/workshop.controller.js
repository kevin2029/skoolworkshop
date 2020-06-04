const assert = require('assert');
const connection = require('../config/database.connection');
const logger = require('../config/config').logger;

let controller = {
    validateWorkshop(req, res, next) {
        try {
            const {
                naamWorkshop,
                beschrijving,
                kosten,
                vervolgKosten,
                categorie
            } = req.body;
            assert(typeof naamWorkshop === 'string', 'Name is missing.');
            assert(typeof beschrijving === 'string', 'Description is missing.');
            assert(typeof kosten === 'string', 'Price is missing.');
            assert(
                typeof vervolgKosten === 'string',+
                'Follow-up price is missing.'
            );
            assert(typeof categorie === 'string', 'categorie is missing.');

            next();
        } catch (err) {
            logger.debug('Error', err);
            res.status(400).json({
                message: 'Error adding workshop!',
                error: err.message
            });
        }
    },

    createWorkshop(req, res, next) {
        logger.info('createworkshop called');
        const workshop = req.body;
        let { naamWorkshop, beschrijving, kosten, vervolgKosten, categorie } = workshop;
        logger.debug('workshop =', workshop);

        let sqlQuery =
            'INSERT INTO `Workshop` (`Naam`, `Beschrijving`, `Kosten`, `VervolgKosten`, `categorie`) VALUES (?, ?, ?, ?, ?)';
        logger.debug('createWorkshop', 'sqlQuery =', sqlQuery);

        connection.connectDatabase(
            sqlQuery,
            [naamWorkshop, beschrijving, kosten, vervolgKosten, categorie],
            (error, results, fields) => {
                logger.debug('connectDatabase called');
                if (error) {
                    logger.debug('createWorkshop', error);
                    res.status(400).json({
                        message: 'Workshop already exists!'
                    });
                }
                if (results) {
                    logger.debug('results: ', results);
                    res.status(200).json({
                        result: {
                            ...workshop
                        }
                    });
                }
            }
        );
    },

    checkDatabase(req, res, next) {
        const workshopName = req.params.naamWorkshop;

        let sqlQuery =
            `SELECT Naam FROM Workshop WHERE Naam = '` + workshopName + `'`;
        logger.debug('checkDatabase', 'sqlQuery = ', sqlQuery);

        connection.connectDatabase(sqlQuery, (error, results, fields) => {
            if (error) {
                logger.debug("Workshop not found")
                res.status(400).json({
                    message: 'Workshop not found'
                });
            } else {
                logger.debug("Workshop found")
                next();
            }
        });
    },
    // Check of workshop in db staat

    deleteWorkshop(req, res, next) {
        logger.info('deleteWorkshop called');
        const workshopName = req.params.naamWorkshop;

        let sqlQuery =
            `DELETE FROM Workshop WHERE Naam = '` + workshopName + `'`;
        logger.debug('deleteWorkshop', 'sqlQuery =', sqlQuery);

        connection.connectDatabase(sqlQuery, (error, results, fields) => {
            if (error) {
                console.log('deleteWorkshop', error);
                res.status(400).json({
                    message: 'deleteWorkshop failed',
                    error: error
                });
            } else {
                res.status(200).json({
                    message: 'Workshop succesfully deleted!'
                });
            }
        });
    },


getOne(req, res, next) {
    const workshopName = req.params.naamWorkshop;

    const query =
        `SELECT Naam, Beschrijving, Kosten, VervolgKosten, Categorie FROM Workshop WHERE Naam = '` +
        workshopName +
        `';`;

    logger.info('getOne:', workshopName);

    connection.connectDatabase(query, (error, results, fields) => {
        if (error) {
            logger.debug(workshopName, query, error);
            res.status(400).json({
                message: 'workshop does not exist!'
            });
        } else {
            res.status(200).json({
                Workshop: results[0]
            });
        }
    });
},

getAll(req, res, next) {
    const query = `SELECT Naam, Beschrijving, Kosten, VervolgKosten, Categorie FROM Workshop;`

    connection.connectDatabase(query, (error, results, fields) => {
        if (error) {
            logger.debug('getAll', query);
            res.status(400).json({
                error: error
            });
        } else if (results.length == 0) {
            res.status(200).json({
                message: 'There are no workshops!'
            });
        } else {
            res.status(200).json({
                Workshops: results
            });
        }
    });
},

checkDatabase(req, res, next) {
    const workshopName = req.params.naamWorkshop;

    const query =
        `SELECT Naam FROM Workshop WHERE Naam = '` + workshopName + `';`;

    connection.connectDatabase(query, (error, results, fields) => {
        if (results.length == 0) {
            logger.debug('checkDatabase:', error);
            res.status(400).json({
                message: 'Workshop not found!'
            });
        } else {
            logger.debug('Workshop found, continuing!');
            next();
        }
    });
},

validateUpdateWorkshop(req, res, next) {
    let { naamWorkshop, beschrijving, kosten, vervolgKosten, categorie } = req.body;

    logger.info('validateUpdateWorkshop:', req.body);
    try {
        assert(typeof naamWorkshop === 'string', 'name is missing.')
        assert(typeof beschrijving === 'string', 'description is missing.')
        assert(typeof kosten === 'string', 'kosten is missing.')
        assert(typeof vervolgKosten === 'string', 'price is missing.')
        assert(typeof categorie === 'string', 'categorie is missing')
        next()
    } catch (err) {
        logger.debug('Error updating workshop:', err.message);
        res.status(400).json({
            message: 'Error updating workshop!',
            error: err.message
        });
    }
},

updateWorkshop(req, res, next) {
    const workshopName = req.params.naamWorkshop;
    logger.info('updateWorkshop', workshopName);

    let { naamWorkshop, beschrijving, kosten, vervolgKosten, categorie } = req.body;
    let query =
        `UPDATE Workshop SET Naam = ?, Beschrijving = ?, Kosten = ?, VervolgKosten = ?, Categorie = ? WHERE Naam = '` +
        workshopName +
        `';`;
    logger.debug("query: ", query);

    connection.connectDatabase(
        query,
        [ naamWorkshop, beschrijving, kosten, vervolgKosten, categorie ],
        (error, results, fields) => {
            if (error) {
                logger.debug('updateWorkshop:', workshopName, req.body, error);
                res.status(400).json({
                    message: 'A workshop with this email already exists!',
                    error: error
                });
            } else {
                logger.info('Workshop updated:', req.body);
                res.status(200).json({
                    message: 'Workshop updated!',
                    result: {
                        ...req.body
                    },
                    test: query
                });
            }
        }
    );
}
};



module.exports = controller