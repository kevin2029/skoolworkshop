const config = require('../config/config')

const assert = require('assert')

let controller = {
    createWorkshop(req, res, next) {
        console.log(method, 'post aangeroepen')
        const workshop = req.body

        try {



            res.status(200).json({
                result: workshop
            })
        } catch (error) {
            res.status(400).json({
                message: 'error creating workshop',
                error: error.toString()
            })
        }
    }

    
}