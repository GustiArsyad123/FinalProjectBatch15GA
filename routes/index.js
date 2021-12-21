const express = require("express");
const router = express.Router();

const cart = require('./cart');
const delivery = require('./delivery');
const order = require('./order');
const rating = require('./rating');
const recipe = require('./recipe');
const review = require('./review');
const user = require('./user');

router.use('/cart', cart);
router.use("/user", user);
router.use("/recipe", recipe);
router.use("/review", review);
router.use("/rating", rating);
router.use("/order", order);

module.exports = router;