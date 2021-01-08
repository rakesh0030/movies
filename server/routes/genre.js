const express = require('express');

const router = express.Router();

const genreController = require('../controllers/genre');

const {requireLogin} = require('../middlewares/requireLogin');

//TODO: add require login and propetly route that is only use single router and apply get and post to it.
router.post('/',requireLogin,genreController.createGenre);

router.get('/',genreController.loadAllGenre);

// router.post('/signup',genreController.signUp);

// router.post('/login',genreController.signIn);

// router.get('/protected',requireLogin,genreController.protected);


module.exports = router;