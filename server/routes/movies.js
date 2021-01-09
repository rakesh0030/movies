const express = require('express');

const router = express.Router();

const moviesController = require('../controllers/movies');

const {requireLogin,isLoggedIn} = require('../middlewares/requireLogin');

router.post('/',requireLogin,moviesController.createMovie);

router.get('/',isLoggedIn,moviesController.loadAllMovies);

router.get('/search/:searchText',moviesController.searchSuggestion);

router.delete('/:movieID',requireLogin,moviesController.deleteMovie);

router.put('/',requireLogin,moviesController.updateMovie);

module.exports = router;
