const {getDb} = require('../utils/database');
const mongodb = require('mongodb');
const { response, request } = require('express');
const {validateFloat , validateInteger, validateString} = require('../utils/validator');
const { JsonWebTokenError } = require('jsonwebtoken');


//TODO : Remove all unnecessary comments


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
    const requestBody  = req.body;
    if(requestBody && !typeof requestBody == "object"){
      throw{
        data : null,
        message : "Request Body is empty/not object.",
        status : 400
      }
    }
    
    const adminID = req.adminID;
    if(!adminID || typeof adminID == "undefined"){
      throw{
        data : null,
        message : "Only admins can add/edit movies.",
        status : 401
      }
    }

    //Taking the whole request in movie obj.
    let movie = {
      ...requestBody
    }

    if( !movie["99popularity"] || !movie.director || !movie.imdb_score || !movie.name || !movie.genre.length || Object.keys(movie).length != 5 )
    throw {
      data : null,
      message: "All/Only fields( name, director, 99popularity, imdb_score,genre) required.",
      status: 400
    };
    
    //Validate all fields

    //Validate movie name
    isNameValidated = validateString(movie.name , {"max" : 100, "min" : 3, "charsNotAllowed" : ['_','@','/','\\','&'] });
    if(!isNameValidated.isValidate){
      throw {
        data : null,
        message : `${isNameValidated.message} : name`,
        status : 400
      }
    }
    //Validate movie director
    isDirectorValidated = validateString(movie.director , {"max" : 60, "min" : 3, "charsNotAllowed" : ['_','@','/','\\','&'] });
    if(!isDirectorValidated.isValidate){
      throw {
        data : null,
        message : `${isDirectorValidated.message} : director`,
        status : 400
      }
    }
    //Validate imdb_score
    isIMDBValidated = validateFloat(movie.imdb_score , {"max" : 10, "min" : 0 });
    if(!isIMDBValidated.isValidate){
      throw {
        data : null,
        message : `${isIMDBValidated.message} : Imdb_Score`,
        status : 400
      }
    }
    //Validate movie 99popularity
    is99PopularityValidated = validateInteger(movie["99popularity"] , {"max" : 100, "min" : 0 });
    if(!is99PopularityValidated.isValidate){
      throw {
        data : null,
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
            data : null,
            message: `${isGenreValidated.message} : genre`,
            status: 400
          }
        }
      }
    }
    else{
      throw{
        data : null,
        message : "Movie genres must be an array.",
        status : 400
      }
    }
    //Getting DB
    const db = getDb();
    db.collection('admins').findOne({_id : mongodb.ObjectId(adminID)})
      .then((admin)=>{
        if(!admin)
        throw {
          data : null,
          message: "Admin doesn't exists.",
          status: 401
        };
        return admin.name;
      })
      .then((adminName)=>{
        return db.collection('movies').insertOne({
          ...movie,
          admin : {
            name : adminName,
            _id : adminID
          }
        })
      })
      .then((r)=>{
        console.log("Response is",r);
        let respObj = {
          data : r.insertedId,
          message : "Movie added successfully",
          status : 200
        }
        res.status(200).json(respObj);
      })
      .catch((err)=>{
        console.log(err);
        res.status(err.status).json(err);
      })
  }
  catch (err) {
    console.log(err);
    res.status(err.status).json(err);
  }
}

exports.updateMovie = (req,res,next) => {
  try {
    //TODO : Check for existence of movie to update and not make any changes if doesn't exist.

    //TODO : Check for wether the admin created this movie is changing it and from there itself get 
    //admin name that will also be added to movie obj.

    //TODO : Check for movie name that it is not change atleast.This should be done in promise 
    //returned from above TODO that is when we are checking for movie existence.
    //OR add movie name as first field in below updateOne that will automatically check for 
    //new Movie name == current movie name.

    const movie = req.body;
    if(movie && !typeof movie == "object"){
      throw{
        data : null,
        message : "Request Body is empty/not object.",
        status : 400
      }
    }
    const movieID = movie.movieID;
    if(!movieID){
      throw{
        data : null,
        message: "Please provide Movie ID to be updated.",
        status: 400
      }
    }
    if(!mongodb.ObjectID.isValid(movieID)){
      throw{
        data : null,
        message: "Please provide a valid movie id.",
        status: 400
      }
    }
    delete movie.movieID;

    const adminID = req.adminID;
    if(!adminID || typeof adminID == "undefined"){
      throw{
        data : null,
        message : "Only admins can add/edit movies.",
        status : 401
      }
    }

    if(movie.name){
      throw {
        data : null,
        message: "Name is not editable.",
        status: 400
      };
    }

    if( !movie["99popularity"] || !movie.director || !movie.imdb_score || !movie.genre.length || Object.keys(movie).length != 4 )
    throw {
      data : null,
      message: "All/Only fields(99popularity, director, imdb_score,genre) required.",
      status: 400
    };
    
    //Validate movie director
    isDirectorValidated = validateString(movie.director , {"max" : 60, "min" : 3, "charsNotAllowed" : ['_','@','/','\\','&'] });
    if(!isDirectorValidated.isValidate){
      throw {
        data : null,
        message : `${isDirectorValidated.message} : director`,
        status : 400
      }
    }
    //Validate imdb_score
    isIMDBValidated = validateFloat(movie.imdb_score , {"max" : 10, "min" : 0 });
    if(!isIMDBValidated.isValidate){
      throw {
        data : null,
        message : `${isIMDBValidated.message} : Imdb_Score`,
        status : 400
      }
    }
    //Validate movie 99popularity
    is99PopularityValidated = validateInteger(movie["99popularity"] , {"max" : 100, "min" : 0 });
    if(!is99PopularityValidated.isValidate){
      throw {
        data : null,
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
            data : null,
            message: `${isGenreValidated.message} : genre`,
            status: 400
          }
        }
      }
    }
    else{
      throw{
        data : null,
        message : "Movie genres must be an array.",
        status : 400
      }
    }

    const db = getDb();
    db.collection('movies').findOne({_id : mongodb.ObjectId(movieID)})
      .then((m)=>{
        if(!m)
        throw {
          data : null,
          message: "Movie doesn't exists.",
          status: 400
        };
        //Checking if the movie is made by the Admin attempting to delete
        const movieByAdmin = m.admin._id;
        if(movieByAdmin != adminID)
        throw {
          data : null,
          message: "Movie doesn't added by Admin( " + m.admin._id + " ).",
          status: 403
        };
        return m;
      })
      .then((m)=>{
        console.log("Movie is",movie);
        return db.collection('movies').updateOne({_id: mongodb.ObjectID(movieID)},{
          '$set' : {...movie} }
          )
      })
      .then((r)=>{
        let respObj = {
          data : null,
          message : "Updated successfully",
          status : 200
        }
        res.status(200).json(respObj);
      })
      .catch((err)=>{
        console.log(err);
        res.status(err.status).json(err);
      })
  }
  catch (err) {
    console.log(err);
    res.status(err.status).json(err);
  }
}

exports.loadAllMovies = (req,res,next) => {
  try{
  /*

  Req obj : {
    searchText(Text from serach bar),
    genres : [](all genres chosen) (if length 0 then dont apply this filter)
    sort : (field name to sort upon)(If empty don't add to aggragtion)
    size : (No. of movies to be shown at max)
    from : (skip these numebr of movies)
  }

  */
  

  let {searchText, genre, sort, size, from} = req.query;
  
  //Validate all incoming fields.
  //Validate searchText
  //Validate movie name
  if(searchText){
    isSearchTextValidated = validateString(searchText , {"charsNotAllowed" : ['_','@','/','\\','&'] });
    if(!isSearchTextValidated.isValidate){
      throw {
        data : null,
        message : `${isSearchTextValidated.message} : search-text.`,
        status : 400
      }
    }
  }
  

  //Validate sort
  if(sort && sort != "director" && sort != "name" && sort!="99popularity" && sort!="imdb_score"){
    throw {
      data : null,
      message : `Sort must be director, name,imdb_score or 99popularity.`,
      status : 400
    }
  }

  //Vaildate size and from//parsing int from size
  size = parseInt(size);
  if(!size || size < 0 || typeof size != "number"){
    size = 10; //Default Value
  }
  //parsing int from "from"
  from = parseInt(from);
  if(!from || from < 0 || typeof size != "number"){
    from =0; //Set from to default 0
  }

  //TODO : When empty array is send to front end make sure to tell No movie found/No genre found.


  let aggregationPipeline = [];

  const adminID = req.adminID ? req.adminID : null;

  //Checking for searchText field
  if(searchText){
    aggregationPipeline.push({ $match: { $or: [ { "name": `${searchText}` }, { "director": `${searchText}` } ] } });
  }

  if(genre && genre.length > 0){
    let matchCriteria = {
      $and : []
    }
    //Converting genre to an array
    genre = genre.split(',');
    //Validate movie genre
    if (Array.isArray(genre)) {
      for (let g = 0; g < genre.length; g++) {
        currGenre = genre[g];
        isGenreValidated = validateString(currGenre, { "max": 50, "min": 3, "charsNotAllowed": ['_', '@', '/', '\\', '&'] });
        if (!isGenreValidated.isValidate) {
          throw {
            data : null,
            message: `${isGenreValidated.message} : genre`,
            status: 400
          }
        }
      }
    }

    let genreRegex = genre.map((g)=>{
      return {
        "genre" : { $regex : ` *${g}`} //Ignoring white spaces before genre.
      }
    })
    aggregationPipeline.push({ $match: { $and :  genreRegex } });
  }

  //Checking if sort field is set
  if(sort){
    const sortField = `${sort}`;
    aggregationPipeline.push({ $sort: { [sortField] : 1 } });
  }

  aggregationPipeline.push({ "$limit": size + from });
  aggregationPipeline.push({ "$skip": from })
  console.log("aggreagtion pipleine",JSON.stringify(aggregationPipeline,null,2));

  //TODO : Currently not making next an previous disabled but will later do. 
    const db = getDb();
    db.collection('movies').aggregate(aggregationPipeline).toArray()
      .then((r) => {
        if(adminID){
          //Compare admin ID with movie.admin._id
          r = r.map((e)=>{
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
        console.log("Response is",r);
        let respObj = {
          data : r,
          message : null,
          status : 200
        }
        res.status(200).json(respObj);
      })
      .catch((err) => {
        console.log(err);
        res.status(err.status).json(err);
      })
  }
  catch (err) {
    console.log(err);
    res.status(err.status).json(err);
  }
}

exports.searchSuggestion = (req,res,next) => {
  
  //Add status code and other check if required here.


  const searchText = req.params.searchText;
  if(!searchText){
    throw{
      data : null,
      message: "Please provide search text",
      status: 400
    }
  }
  const regex = `^${searchText}`;
  const findCriteria = { $or: [ { "name": { $regex: regex, $options : 'i'  }  }, { "director": { $regex: regex, $options: 'i' }  } ] }
  
  try {
    const db = getDb();
    db.collection('movies').find(findCriteria).limit(10).toArray()
      .then((r) => {
        let respObj = {
          data : r,
          message : null,
          status : 200
        }
        res.status(200).json(respObj);
      })
      .catch((err) => {
        console.log(err);
        res.status(err.status).json(err);
      })
  }
  catch (err) {
    console.log(err);
    res.status(err.status).json(err);
  }
}

exports.deleteMovie = (req,res,next) => {
  try {
    const movieID  = req.params.movieID;
    if(!movieID){
      throw{
        data : null,
        message: "Please provide Movie ID to be deleted.",
        status: 400
      }
    }
    if(!mongodb.ObjectID.isValid(movieID)){
      throw{
        data : null,
        message: "Please provide a valid movie id.",
        status: 400
      }
    }
    const adminID = req.adminID;
    if(!adminID){
      throw{
        data : null,
        message: "Only admins can add/edit/delete movies.",
        status: 401
      }
    }
    
    const db = getDb();
    db.collection('movies').findOne({_id : mongodb.ObjectId(movieID)})
      .then((movie)=>{
        if(!movie)
        throw {
          data : null,
          message: "Movie doesn't exists.",
          status: 400
        };
        //Checking if the movie is made by the Admin attempting to delete
        const movieByAdmin = movie.admin._id;
        if(movieByAdmin != adminID)
        throw {
          data : null,
          message: "Movie doesn't added by Admin( " + movie.admin._id + " ).",
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
        let respObj = {
          data : null,
          message : "Deleted successfully",
          status : 200
        }
        res.status(200).json(respObj);
      })
      .catch((err)=>{
        console.log(err);
        res.status(err.status).json(err);
      })
  }
  catch (err) {
    console.log(err);
    res.status(err.status).json(err);
  }
}


