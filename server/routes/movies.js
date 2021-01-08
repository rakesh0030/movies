const express = require('express');

const router = express.Router();

const moviesController = require('../controllers/movies');

const {requireLogin,isLoggedIn} = require('../middlewares/requireLogin');

router.post('/',requireLogin,moviesController.createMovie);

//TODO : Check and change the below route to get/post and also their api design as well
// router.post('/loadAll',isLoggedIn,moviesController.loadAllMovies);
router.get('/',isLoggedIn,moviesController.loadAllMovies);

router.get('/search/:searchText',moviesController.searchSuggestion);

//TODO : Add require Login to below route
router.delete('/:movieID',requireLogin,moviesController.deleteMovie);

//TODO : Add require Login to below route
router.put('/',requireLogin,moviesController.updateMovie);

// router.get('/user-post',requireLogin,postsController.loadUserPosts);

// router.get('/user-post/:userID',requireLogin,postsController.loadOtherUserPosts);

// router.get('/all-post',requireLogin,postsController.loadAllPosts);

// router.delete('/post/:postID',requireLogin,postsController.deletePost);

// router.put('/post-liked',requireLogin,postsController.registerLikeForPost);

// router.put('/post-disliked',requireLogin,postsController.registerDislikeForPost);

// router.put('/post-comment',requireLogin,postsController.registerCommentForPost);




module.exports = router;
