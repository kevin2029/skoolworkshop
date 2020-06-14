const express = require('express');
const router = express.Router();
const invoicecontroller = require('../controllers/invoice.controller');
const authcontroller = require('../controllers/authenication.controller');

router.post(
    '/invoice',
    authcontroller.validateAdmin,
    invoicecontroller.validateInvoice,
    invoicecontroller.createInvoice
);
router.delete(
    '/invoice/:ID',
    invoicecontroller.checkDatabase,
    invoicecontroller.deleteInvoice
);
router.get('/invoice/:ID', invoicecontroller.getOne);
router.get('/invoice', invoicecontroller.getAll);
router.get(
    '/invoice/CheckPayment/:ID',
    invoicecontroller.checkDatabase,
    invoicecontroller.getPayment
);
router.put(
    '/invoice/:ID',
    invoicecontroller.checkDatabase,
    invoicecontroller.validateUpdateInvoice,
    invoicecontroller.updateInvoice
);

module.exports = router;
