const logger = require('../config/config').logger
const assert = require('assert')
const connection = require('../config/database.connection')

let controller = {
  validateUser(req, res, next) {
    let { Naam, Email, Organisatie, Adress, Wachtwoord } = req.body

    logger.info('validateUser:', req.body)
    try {
      // Missing values giving errors
      assert(typeof Naam === 'string', 'Name is missing!')
      assert(typeof Email === 'string', 'Email is missing!')
      assert(typeof Organisatie === 'string', 'Organisation is missing!')
      assert(typeof Adress === 'string', 'Address is missing!')
      assert(typeof Wachtwoord === 'string', 'Password is missing!')

      // Invalid values giving errors
      assert.match(
        req.body.Email,
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Email is invalid!'
      )

      next()
    } catch (err) {
      logger.debug('Error adding user:', err.message)
      res.status(400).json({
        message: 'Error adding user!',
        error: err.message
      })
    }
  },

  createUser(req, res, next) {
    logger.info('createUser:', req.body)

    let { Naam, Email, Organisatie, Adress, Wachtwoord } = req.body
    let query =
      'INSERT INTO gebruiker (Naam, Email, Organisatie, Adress, Wachtwoord) VALUES (?, ?, ?, ?, ?);'

    connection.connectDatabase(
      query,
      [Naam, Email, Organisatie, Adress, Wachtwoord],
      (error, results, fields) => {
        if (error) {
          logger.debug('createUser:', req.body, error)
          res.status(400).json({
            message: 'A user with this email already exists!'
          })
        } else {
          logger.info('User added:', req.body)
          res.status(200).json({
            message: 'User added!',
            result: {
              ...req.body
            }
          })
        }
      }
    )
  },

  getOne(req, res, next) {
    const userMail = req.params.userMail

    const query =
      `SELECT Naam, Email, Organisatie, Adress FROM gebruiker WHERE Email = '` +
      userMail +
      `';`

    logger.info('getOne:', userMail)

    connection.connectDatabase(query, (error, results, fields) => {
      if (error) {
        logger.debug(userMail, query, error)
        res.status(400).json({
          message: 'User does not exist!'
        })
      } else {
        res.status(200).json({
          User: results[0]
        })
      }
    })
  },

  getAll(req, res, next) {
    const query = 'SELECT Naam, Email, Organisatie, Adress FROM gebruiker;'

    connection.connectDatabase(query, (error, results, fields) => {
      if (error) {
        logger.debug('getAll', query)
        res.status(400).json({
          error: error
        })
      } else if (results.length == 0) {
        res.status(200).json({
          message: 'There are no users!'
        })
      } else {
        res.status(200).json({
          Users: results
        })
      }
    })
  },

  checkDatabase(req, res, next) {
    const userMail = req.params.userMail

    const query = `SELECT Naam FROM Gebruiker WHERE Email = '` + userMail + `';`

    connection.connectDatabase(query, (error, results, fields) => {
      if (results.length == 0) {
        logger.debug('checkDatabase:', error)
        res.status(400).json({
          message: 'User not found!'
        })
      } else {
        logger.debug('User found, continuing!')
        next()
      }
    })
  },

  deleteUser(req, res, next) {
    const userMail = req.params.userMail

    const query = `DELETE FROM Gebruiker WHERE Email = '` + userMail + `';`

    connection.connectDatabase(query, (error, results, fields) => {
      if (error) {
        logger.debug('deleteUser', userMail, error)
        res.status(400).json({
          error: error
        })
      } else {
        logger.info(userMail, 'deleted!')
        res.status(200).json({
          message: 'User deleted!'
        })
      }
    })
  },

  validateUpdateUser(req, res, next) {
    let { Naam, Email, Organisatie, Adress } = req.body

    logger.info('validateUpdateUser:', req.body)
    try {
      // Missing values giving errors
      assert(typeof Naam === 'string', 'Name is missing!')
      assert(typeof Email === 'string', 'Email is missing!')
      assert(typeof Organisatie === 'string', 'Organisation is missing!')
      assert(typeof Adress === 'string', 'Address is missing!')

      // Invalid values giving errors
      assert.match(
        req.body.Email,
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Email is invalid!'
      )

      next()
    } catch (err) {
      logger.debug('Error updating user:', err.message)
      res.status(400).json({
        message: 'Error updating user!',
        error: err.message
      })
    }
  },

  updateUser(req, res, next) {
    const userMail = req.params.userMail
    logger.info('updateUser:', userMail)

    let { Naam, Email, Organisatie, Adress } = req.body
    let query =
      `UPDATE Gebruiker SET Naam = ?, Email = ?, Organisatie = ?, Adress = ? WHERE Email = '` +
      userMail +
      `';`

    connection.connectDatabase(
      query,
      [Naam, Email, Organisatie, Adress],
      (error, results, fields) => {
        if (error) {
          logger.debug('updateUser:', userMail, req.body, error)
          res.status(400).json({
            message: 'A user with this email already exists!',
            error: error
          })
        } else {
          logger.info('User updated:', req.body)
          res.status(200).json({
            message: 'User updated!',
            result: {
              ...req.body
            },
            test: query
          })
        }
      }
    )
  }
}

module.exports = controller
