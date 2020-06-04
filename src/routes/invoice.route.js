const express = require('express');
const router = express.Router();
const invoicecontroller = require('../controllers/invoice.controller');
// authenticationcontroller

router.post(
    '/invoice',
    invoicecontroller.validateInvoice,
    invoicecontroller.createInvoice
);
router.delete(
    '/invoice/:ID',
    invoicecontroller.checkDatabase,
    invoicecontroller.deleteInvoice
);
router.get('/invoice/:invoiceMail', invoicecontroller.getOne);
router.get('/invoice', invoicecontroller.getAll);
router.put(
    '/invoice/:invoiceMail',
    invoicecontroller.checkDatabase,
    invoicecontroller.validateUpdateInvoice,
    invoicecontroller.updateInvoice
);

module.exports = router;
