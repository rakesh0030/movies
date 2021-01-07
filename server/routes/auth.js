const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

const {requireLogin} = require('../middlewares/requireLogin');

router.post('/signup',authController.signUp);

router.post('/login',authController.signIn);

router.get('/protected',requireLogin,authController.protected);


module.exports = router;