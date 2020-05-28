const config = require('../config/config')
const assert = require('assert')


let controller = {
    validateWorkshop(req, res, next) {
        try {
            const { name, description, tijdsduur, price } = req.body
            assert(typeof name === 'string', 'name is missing.')
            assert(typeof description === 'string', 'description is missing.')
            assert(typeof tijdsduur === 'number', 'tijdsduur is missing.')
            assert(typeof price === 'number', 'price is missing.')
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
        let { naam, beschrijving, kosten, vervolgKosten, genre } = workshop
        console.log('workshop =', workshop)        

        let sqlQuery =
        'INSERT INTO `Workshop` (`Naam`, `Beschrijving`, `Kosten`, `Vervolg Kosten`, `genre`) VALUES (?, ?, ?, ?, ?)'
        logger.debug('createWorkshop', 'sqlQuery =', sqlQuery)

        connection.query(
            sqlQuery,
            [ naam, beschrijving, kosten, vervolgKosten, genre ],
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
        'DELETE FROM `Workshop` WHERE Naam =' + workshopName
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
    }
  
}

module.exports = controller