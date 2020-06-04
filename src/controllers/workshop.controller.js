const config = require('../config/config')
const assert = require('assert')


let controller = {
    validateWorkshop(req, res, next) {
        try {
            const { name, description, tijdsduur, price } = req.body
            assert(typeof naam === 'string', 'name is missing.')
            assert(typeof beschrijving === 'string', 'description is missing.')
            assert(typeof Kosten === 'number', 'tijdsduur is missing.')
            assert(typeof vervolgKosten === 'number', 'price is missing.')
            assert(typeof categorie === 'string', 'categorie is missing')
            next()
        } catch (err) {
            res.status(400).json({
                message: 'error',
                error: err.toString()
            })
        }
    },

    createWorkshop(req, res, next) {
        logger.info('createworkshop called')
        const workshop = req.body
        let { naam, beschrijving, kosten, vervolgKosten, categorie } = workshop
        console.log('workshop =', workshop)        

        let sqlQuery =
        'INSERT INTO `Workshop` (`Naam`, `Beschrijving`, `Kosten`, `Vervolg Kosten`, `Categorie`) VALUES (?, ?, ?, ?, ?)'
        logger.debug('createWorkshop', 'sqlQuery =', sqlQuery)

        connection.query(
            sqlQuery,
            [ naam, beschrijving, kosten, vervolgKosten, categorie ],
            (error, results, fields) => {
                
                connection.release()
                
                if (error) {
                console.log('createWorkshop', error)
                res.status(400).json({
                    message: 'createWorkshop failed calling query',
                    error: error
                    })
                }
                if (results) {
                    console.log('results: ', results)
                    res.status(200).json({
                        result: {
                            ...workshop
                        }
                    })
                }
            }
        )
    },
    
    deleteWorkshop(req, res, next) {
        logger.info('deleteWorkshop called')
        const workshopName = req.params.name

        let sqlQuery = 
        'DELETE FROM Workshop WHERE Naam =' + workshopName
        logger.debug('deleteWorkshop', 'sqlQuery =', sqlQuery)

        connection.query(
            sqlQuery,
            (error, results, fields) => {
                connection.release()

                if (error) {
                    console.log('deleteWorkshop', error)
                    res.status(400).json({
                        message: 'deleteWorkshop failed',
                        error: error
                    })
                }
                if (results) {
                    console.log('results: ', results)
                    cres.status(200).json({
                        result: {
                            ...workshop
                        }
                    })
                }
            }
        )
    },

    getOne(req, res, next) {
        const workshopName = req.params.workshopName;

        const query =
            `SELECT Naam, Beschrijving, Kosten, Vervolg Kosten, Categorie FROM Workshop WHERE Naam = '` +
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
                    User: results[0]
                });
            }
        });
    },

    getAll(req, res, next) {
        const query = `SELECT Naam, Beschrijving, Kosten, Vervolg Kosten, Categorie FROM Workshop;'`

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
                    Users: results
                });
            }
        });
    },

    checkDatabase(req, res, next) {
        const workshopName = req.params.workshopName;

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

    validateUpdateUser(req, res, next) {
        let { Naam, Email, Organisatie, Adress } = req.body;

        logger.info('validateUpdateUser:', req.body);
        try {
            assert(typeof naam === 'string', 'name is missing.')
            assert(typeof beschrijving === 'string', 'description is missing.')
            assert(typeof Kosten === 'number', 'tijdsduur is missing.')
            assert(typeof vervolgKosten === 'number', 'price is missing.')
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
        const workshopName = req.params.workshopName;
        logger.info('updateWorkshop', workshopName);

        let { naam, beschrijving, kosten, vervolgKosten, categorie } = req.body;
        let query =
            `UPDATE Workshop SET Naam = ?, Besschrijving = ?, Kosten = ?, VervolgKosten = ?, Categorie = ? WHERE name = '` +
            workshopName +
            `';`;

        connection.connectDatabase(
            query,
            [ naam, beschrijving, kosten, vervolgKosten, categorie ],
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
}



module.exports = controller