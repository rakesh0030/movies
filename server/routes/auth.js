const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

const {requireLogin} = require('../middlewares/requireLogin');

router.post('/signup',requireLogin,authController.signUp);

router.post('/login',authController.logIn);


module.exports = router;