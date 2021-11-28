const express = require('express');
// const { signUpValidator, changePassword } = require('../middlewares/validators/signUpValidator');
// const { signUpCompleteValidator } = require('../middlewares/validators/signUpCompleteValidator');
// const { signInValidator } = require('../middlewares/validators/signInValidator');
// const { updateUserValidator } = require('../middlewares/validators/updateUserValidator');
const { authentication } = require('../middlewares/Auth/authentication');

const {
    createRecipeOne,
    createRecipeTwo,
    createRecipeThree,
    createRecipeFour,
    getAllRecipeFiltered,
    getAllRecipe,
    getDetailRecipe,
    updateRecipe,
    deleteRecipe
} = require('../controllers/recipe');

const router = express.Router();

router.post('/', authentication, createRecipeOne);
router.put('/steptwo/:id', authentication, createRecipeTwo);
router.put('/stepthree/:id', authentication, createRecipeThree);
router.put('/stepfour/:id', authentication, createRecipeFour);
router.get('/filter', authentication, getAllRecipe);
router.get('/', authentication, getAllRecipe);
router.get('/:id', authentication, getDetailRecipe);
router.put('/:id', authentication, updateRecipe);
router.delete('/:id', authentication, deleteRecipe);

module.exports = router; 