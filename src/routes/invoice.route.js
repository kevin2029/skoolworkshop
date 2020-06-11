const express = require('express');
const router = express.Router();
const invoicecontroller = require('../controllers/invoice.controller');
// authenticationcontroller

router.post(
    '/',
    invoicecontroller.validateInvoice,
    invoicecontroller.createInvoice
);
router.delete(
    '/:ID',
    invoicecontroller.checkDatabase,
    invoicecontroller.deleteInvoice
);
router.get('/:ID', invoicecontroller.getOne);
router.get('/', invoicecontroller.getAll);
router.get(
    '/CheckPayment/:ID', 
    invoicecontroller.checkDatabase,
    invoicecontroller.getPayment
);
router.put(
    '/:ID',
    invoicecontroller.checkDatabase,
    invoicecontroller.validateUpdateInvoice,
    invoicecontroller.updateInvoice
);

module.exports = router;
