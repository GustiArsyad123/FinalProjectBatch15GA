const express = require('express');
const { authentication } = require('../middlewares/Auth/authentication');

const {
    createPayment,
    getCheckout,
    editAddressDelivery,
    confirmPayment
} = require('../controllers/order');

const router = express.Router();

router.get('/', authentication, getCheckout);
router.post('/', authentication, createPayment);
router.post('/delivery', authentication, editAddressDelivery);
router.put('/', authentication, confirmPayment);

module.exports = router; 