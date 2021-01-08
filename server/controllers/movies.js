const {getDb} = require('../utils/database');
const mongodb = require('mongodb');
const { response } = require('express');
const {validateFloat , validateInteger, validateString} = require('../utils/validator');


//TODO : Remove all unnecessary comments

//TODO: Add validator for password to have atleast one lowercase, one uppercase, one number and one special char
// Also admin name must be between [3,50].
// Also password must be between [8,50]
//TODO : But these above only in case of sign up for admin provided.

/*

Validation is required in createMovie, updateMovie, loadALlMovie,searchSuggestion, deleteMovie

Also let's say movie name must be between [3,100].
Also director name must be [3,60].
Also genre's name must be [3,50].
Also imdb_score must be a float between [0,10].
Also 99popularity must be integer between [0,100].


*/

exports.createMovie = (req,res,next) => {
  try {
    const movie  = req.body.movie;
    // const adminID = req.admin_id;
    //TODO : change later to be JWT token
    const adminID = req.adminID;

    console.log("Movie obj is",movie);

    if( !movie["99popularity"] || !movie.director || !movie.imdb_score || !movie.name || !movie.genre.length)
    throw {
      message: "All fields(99popularity, director, name, imdb_score,genre) required.",
      //TODO : change all status code properly.
      status: 400
    };
    //Validate all fields

    //Validate movie name
    isNameValidated = validateString(movie.name , {"max" : 100, "min" : 3, "charsNotAllowed" : ['_','@','/','\\','&'] });
    if(!isNameValidated.isValidate){
      throw {
        message : `${isNameValidated.message} : name`,
        status : 400
      }
    }
    //Validate movie director
    isDirectorValidated = validateString(movie.director , {"max" : 60, "min" : 3, "charsNotAllowed" : ['_','@','/','\\','&'] });
    if(!isDirectorValidated.isValidate){
      throw {
        message : `${isDirectorValidated.message} : director`,
        status : 400
      }
    }
    //Validate imdb_score
    isIMDBValidated = validateFloat(movie.imdb_score , {"max" : 10, "min" : 0 });
    if(!isIMDBValidated.isValidate){
      throw {
        message : `${isIMDBValidated.message} : Imdb_Score`,
        status : 400
      }
    }
    //Validate movie 99popularity
    is99PopularityValidated = validateInteger(movie["99popularity"] , {"max" : 100, "min" : 0 });
    if(!is99PopularityValidated.isValidate){
      throw {
        message : `${is99PopularityValidated.message} : 99popularity`,
        status : 400
      }
    }
    //Validate movie genres
    if (Array.isArray(movie.genre)) {
      for (let g = 0; g < movie.genre.length; g++) {
        currGenre = movie.genre[g];
        isGenreValidated = validateString(currGenre, { "max": 50, "min": 3, "charsNotAllowed": ['_', '@', '/', '\\', '&'] });
        if (!isGenreValidated.isValidate) {
          throw {
            message: `${isGenreValidated.message} : genre`,
            status: 400
          }
        }
      }
    }
    
    console.log(adminID);

    const db = getDb();
    db.collection('admins').findOne({_id : mongodb.ObjectId(adminID)})
      .then((admin)=>{
        if(!admin)
        throw {
          message: "Admin doesn't exists.",
          //TODO : change all status code properly.
          status: 403
        };
        return admin.name;
      })
      .then((adminName)=>{
        return db.collection('movies').insertOne({
          // "99popularity" : movie["99popularity"],
          // director : movie.director,
          // imdb_score : movie.imdb_score,
          // name : movie.name,
          // genre : movie.genre,
          ...movie,
          admin : {
            name : adminName,
            _id : adminID
          }
        })
      })
      .then((r)=>{
        res.status(200).send("Movie added successfully");
      })
      .catch((err)=>{
        console.log(err);
        res.status(err.message).send(err.status);
      })
    
  }
  catch (err) {
    console.log(err);
    res.status(err.message).send(err.status);
  }
}

exports.loadAllMovies = (req,res,next) => {
  try{
  /*

  Req obj : {
    searchText(Text from serach bar), //TODO: check against both movie name and director name
    genres : [](all genres chosen) (if length 0 then dont apply this filter)
    sort : (field name to sort upon)(If empty don't add to aggragtion)
    size : (No. of movies to be shown at max)
    from : (skip these numebr of movies)
    //TODO : Add pagination wala fields as well.
  }

  */
  //TODO : Change thsi to a get route so that we are getting everything from 
  //req.query
  console.log("Query is",req.query);

  let {searchText, genres, sort, size, from} = req.query;
  
  //Validate all incoming fields.
  //Validate searchText
  //Validate movie name
  isSearchTextValidated = validateString(searchText , {"charsNotAllowed" : ['_','@','/','\\','&'] });
  if(!isSearchTextValidated.isValidate){
    throw {
      message : `${isSearchTextValidated.message} : search-text.`,
      status : 400
    }
  }

  //TODO : Add Imdb score to sort dropdown.
  //Validate sort
  if(sort && (sort != "director" && sort != "name" && sort!="99popularity" && sort!="imdb_score")){
    throw {
      message : `Sort must be director, name or 99popularity.`,
      status : 400
    }
  }


  let aggregationPipeline = [];

  console.log("Admin ID",req.adminID);

  const adminID = req.adminID ? req.adminID : null;

  //TODO : Check for search and sort filter

  //Checking for searchText field
  if(searchText){
    aggregationPipeline.push({ $match: { $or: [ { "name": `${searchText}` }, { "director": `${searchText}` } ] } });
  }

  //TODO : Later make above and this below query one only by appending to it only the filters as well
  //Checking if we are filtering for genres

  if(genres && genres.length > 0){
    let matchCriteria = {
      $and : []
    }
    //Converting genres to an array
    genres = genres.split(',');
    //Validate movie genres
    if (Array.isArray(genres)) {
      for (let g = 0; g < genres.length; g++) {
        currGenre = genres[g];
        isGenreValidated = validateString(currGenre, { "max": 50, "min": 3, "charsNotAllowed": ['_', '@', '/', '\\', '&'] });
        if (!isGenreValidated.isValidate) {
          throw {
            message: `${isGenreValidated.message} : genre`,
            status: 400
          }
        }
      }
    }

    let genresRegex = genres.map((genre)=>{
      return {
        "genre" : { $regex : ` *${genre}`} //Ignoring white spaces before.
      }
    })
    aggregationPipeline.push({ $match: { $and :  genresRegex } });
  }

  //Checking if sort field is set
  //TODO : Later try to give functionality to sort on multiple fields and also order to sort on
  if(sort){
    const sortField = `${sort}`;
    console.log(sortField);
    aggregationPipeline.push({ $sort: { [sortField] : 1 } });
  }


  //parsing int from size
  size = parseInt(size);
  if(!size || size < 0){
    size = 10; //Default Value
  }
  //parsing int from "from"
  from = parseInt(from);
  if(!from || from < 0){
    from =0; //Set from to default 0
  }

  aggregationPipeline.push({ "$limit": size + from });
  aggregationPipeline.push({ "$skip": from })

  console.log(aggregationPipeline);

  //TODO : Currently not making next an previous disabled but will later do.

  //TODO : Check below functionality and add cursor if required
  
    const db = getDb();
    db.collection('movies').aggregate(aggregationPipeline).toArray()
      .then((r) => {
        if(adminID){
          //Compare admin ID with movie.admin._id
          r = r.map((e)=>{
            console.log("e.admin._id",e.admin._id);
            e.isModificationAllowed = e.admin._id == adminID;
            delete e.admin;
            return e;
          })
        }
        else{
          //TODO: Make a seperate function for this removal of admin
          r = r.map((e)=>{
            delete e.admin;
            e.isModificationAllowed = false;
            return e;
          })
        }
        res.status(200).send(r);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      })
  }
  catch (err) {
    console.log(err);
    res.status(err.message).send(err.status);
  }
}

exports.searchSuggestion = (req,res,next) => {
  
  //Add status code and other check if required here.

  //TODO : Check all possiblities like search suggestion is not have search text.
  //TODO : Add correct res catcher like create movie when I throw a error.

  const body = req.params.searchText;
  const regex = `^${body}`;
  const findCriteria = { $or: [ { "name": { $regex: regex, $options : 'i'  }  }, { "director": { $regex: regex, $options: 'i' }  } ] }

  

  //TODO : Check below functionality and add cursor if required
  try {
    const db = getDb();
    //TODO : Change the below find to findMany or look into it.
    db.collection('movies').find(findCriteria).limit(10).toArray()
      .then((r) => {
        res.status(200).send(r);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      })
  }
  catch (err) {
    console.log(err);
    res.status(err.message).send(err.status);
  }
}

exports.deleteMovie = (req,res,next) => {
  try {
    const movieID  = req.params.movieID;
    // const adminID = req.admin_id;
    //TODO : change later to be JWT token
    const adminID = req.adminID;

    const db = getDb();
    db.collection('movies').findOne({_id : mongodb.ObjectId(movieID)})
      .then((movie)=>{
        if(!movie)
        //TODO : Correct status message below
        throw {
          message: "Movie doesn't exists.",
          status: 400
        };
        //Checking if the movie is made by the Admin attempting to delete
        const movieByAdmin = movie.admin._id;
        if(movieByAdmin != adminID)
        throw {
          message: "Movie doesn't added by Admin( " + movie.authorName + " ).",
          status: 403
        };
        return movie;
      })
      .then((movie)=>{
        return db.collection('movies').deleteOne({
          _id : mongodb.ObjectId(movieID)
        })
      })
      .then((r)=>{
        res.status(200).send("movie deleted successfully");
      })
      .catch((err)=>{
        console.log(err);
        res.status(err.message).send(err.status);
      })
    
  }
  catch (err) {
    console.log(err);
    res.status(err.message).send(err.status);
  }
}

exports.updateMovie = (req,res,next) => {
  try {
    const {movieID, movie} = req.body;
    const db = getDb();
    console.log("Request Object is ",req.body);
    //TODO : Chek for existence of movie to update and not make any changes if doesn't exist.

    //TODO : Check for wether the admin created this movie is changing it and from there itself get 
    //admin name that will also be added to movie obj.

    //TODO : Check for movie name that it is not change atleast.This should be done in promise 
    //returned from above TODO that is when we are checking for movie existence.
    //OR add movie name as first field in below updateOne that will automatically check for 
    //new Movie name == current movie name.
    db.collection('movies').updateOne({_id: mongodb.ObjectID(movieID)},{
    '$set' : {...movie} }
    )
      .then((r) => {
        res.status(200).send(r);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      })
  }
  catch (err) {
    console.log(err);
    res.status(err.message).send(err.status);
  }
}
