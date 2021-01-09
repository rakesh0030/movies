const express = require('express');

const router = express.Router();

const genreController = require('../controllers/genre');

const {requireLogin} = require('../middlewares/requireLogin');

router.post('/',requireLogin,genreController.createGenre);

router.get('/',genreController.loadAllGenre);


module.exports = router;