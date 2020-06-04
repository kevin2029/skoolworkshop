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
router.get('/Invoice/:InvoiceMail', invoicecontroller.getOne);
router.get('/Invoice', invoicecontroller.getAll);
router.put(
    '/Invoice/:InvoiceMail',
    invoicecontroller.checkDatabase,
    invoicecontroller.validateUpdateInvoice,
    invoicecontroller.updateInvoice
);

module.exports = router;
