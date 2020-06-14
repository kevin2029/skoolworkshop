const express = require('express');
const router = express.Router();
const invoicecontroller = require('../controllers/invoice.controller');
const authcontroller = require('../controllers/authenication.controller');

router.post(
    '/create',
    invoicecontroller.validateInvoice,
    invoicecontroller.createInvoice
);
router.post(
    '/delete/:ID',
    invoicecontroller.checkDatabase,
    invoicecontroller.deleteInvoice
);
router.get('/getone/:ID', invoicecontroller.getOne);
router.get('/getallpaid', invoicecontroller.getAllPaid);
router.get('/getallunpaid', invoicecontroller.getAllUnpaid);
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
