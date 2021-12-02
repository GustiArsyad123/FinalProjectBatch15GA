const express = require('express');
const { authentication } = require('../middlewares/Auth/authentication');

const { createRating, getRating } = require('../controllers/rating');

const router = express.Router();

router.post('/:idRecipe', authentication, createRating);
router.get('/:idRecipe', authentication, getRating);

module.exports = router; 