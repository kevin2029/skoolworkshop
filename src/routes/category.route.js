const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

router.get('/getall', categoryController.getAll);

module.exports = router;