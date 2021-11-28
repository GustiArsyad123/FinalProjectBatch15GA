const express = require('express');
const { createRecipeOneValidator } = require('../middlewares/validators/createRecipeOneValidator');
const { createRecipeTwoValidator } = require('../middlewares/validators/createRecipeTwoValidator');
const { createRecipeThreeValidator } = require('../middlewares/validators/createRecipeThreeValidator');
const { createRecipeFourValidator } = require('../middlewares/validators/createRecipeFourValidator');
const { authentication } = require('../middlewares/Auth/authentication');

const {
    createRecipeOne,
    createRecipeTwo,
    createRecipeThree,
    createRecipeFour,
    getAllRecipeFiltered,
    getAllRecipe,
    getDetailRecipe,
    searchRecipe,
    updateRecipe,
    deleteRecipe
} = require('../controllers/recipe');

const router = express.Router();

router.post('/', createRecipeOneValidator, authentication, createRecipeOne);
router.put('/steptwo/:id', createRecipeTwoValidator, authentication, createRecipeTwo);
router.put('/stepthree/:id', createRecipeThreeValidator, authentication, createRecipeThree);
router.put('/stepfour/:id', createRecipeFourValidator, authentication, createRecipeFour);
router.get('/filter', authentication, getAllRecipeFiltered);
router.get('/search', authentication, searchRecipe);
router.get('/', authentication, getAllRecipe);
router.get('/:id', authentication, getDetailRecipe);
router.put('/:id', authentication, updateRecipe);
router.delete('/:id', authentication, deleteRecipe);

module.exports = router; 