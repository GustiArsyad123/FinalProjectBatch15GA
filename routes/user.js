const express = require('express');
const { signUpValidator } = require('../middlewares/validators/signUpValidator');
const { signUpCompleteValidator } = require('../middlewares/validators/signUpCompleteValidator');
const { signInValidator } = require('../middlewares/validators/signInValidator');
const { authentication } = require('../middlewares/auth/authentication');
const { authorization } = require('../middlewares/auth/authorization');

const {
    createUser,
    getDetailUser,
    updateUser,
    deleteUser,
    login,
    updatePassword
} = require('../controllers/user');

const router = express.Router();

router.post('/signup', signUpValidator, createUser);
router.put('/complete-signup', createUser);
router.post('/login', login);
router.put('/changeprofile', updateUser);
router.put('/changepassword', updatePassword);
router.get('/', getDetailUser);
router.delete('/', deleteUser);

module.exports = router; 