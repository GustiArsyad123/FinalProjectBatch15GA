const express = require('express');
const { signUpValidator, changePassword } = require('../middlewares/validators/signUpValidator');
const { signUpCompleteValidator } = require('../middlewares/validators/signUpCompleteValidator');
const { signInValidator } = require('../middlewares/validators/signInValidator');
const { updateUserValidator } = require('../middlewares/validators/updateUserValidator');
const { authentication } = require('../middlewares/Auth/authentication');

const {
    createUser,
    getDetailUser,
    updateUser,
    deleteUser,
    login,
    updatePassword,
    completeSignUp
} = require('../controllers/user');

const router = express.Router();

router.post('/signup', signUpValidator, createUser);
router.patch('/complete-signup', signUpCompleteValidator, authentication, completeSignUp);
router.post('/login', signInValidator, login);
router.patch('/changeprofile', updateUserValidator, authentication, updateUser);
router.put('/changepassword', changePassword, authentication, updatePassword);
router.get('/', authentication, getDetailUser);
router.delete('/', authentication, deleteUser);

module.exports = router; 