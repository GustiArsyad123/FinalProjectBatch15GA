const express = require('express');
const { createOrUpdateReviewValidator } = require('../middlewares/validators/createOrUpdateReviewValidator');
const { authentication } = require('../middlewares/Auth/authentication');

const {
    createReview,
    getAllreview,
    getDetailReview,
    updateReview,
    deleteReview
} = require('../controllers/review');

const router = express.Router();

router.post('/:idRecipe', createOrUpdateReviewValidator, authentication, createReview);
router.get('/:idRecipe', authentication, getAllreview);
router.get('/:idRecipe/:idReview', authentication, getDetailReview);
router.put('/:idRecipe/:idReview', createOrUpdateReviewValidator, authentication, updateReview);
router.delete('/:idRecipe/:idReview', authentication, deleteReview);

module.exports = router; 