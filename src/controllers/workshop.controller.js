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
        let { name, description, tijdsduur, price } = workshop
        console.log('workshop =', workshop)        

        let sqlQuery =
        //query hier
        logger.debug('createWorkshop', 'sqlQuery =', sqlQuery)

        connection.query(
            sqlQuery,
            [name, description, tijdsduur, price],
            (error, results, fields) => {
                // When done with the connection, release it.
                connection.release()
                // Handle error after the release.
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
                    id: results.insertId,
                    ...movie
                    }
                })
                }
            }
            )
  
}

module.exports = controller