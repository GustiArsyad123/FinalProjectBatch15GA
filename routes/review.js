const express = require('express');
// const { createRecipeOneValidator } = require('../middlewares/validators/createRecipeOneValidator');
// const { createRecipeTwoValidator } = require('../middlewares/validators/createRecipeTwoValidator');
// const { createRecipeThreeValidator } = require('../middlewares/validators/createRecipeThreeValidator');
// const { createRecipeFourValidator } = require('../middlewares/validators/createRecipeFourValidator');
const { authentication } = require('../middlewares/Auth/authentication');

const {
    createReview,
    getAllreview,
    getDetailReview,
    updateReview,
    deleteReview
} = require('../controllers/review');

const router = express.Router();

router.post('/:idRecipe', authentication, createReview);
router.get('/:idRecipe', authentication, getAllreview);
router.get('/:idRecipe/:idReview', authentication, getDetailReview);
router.put('/:idRecipe/:idReview', authentication, updateReview);
router.delete('/:idRecipe/:idReview', authentication, deleteReview);

module.exports = router; 