const express = require('express');
const { authentication } = require('../middlewares/Auth/authentication');

const {
    addCart,
} = require('../controllers/cart');

const router = express.Router();

router.post('/:idRecipe', authentication, addCart);

module.exports = router; 