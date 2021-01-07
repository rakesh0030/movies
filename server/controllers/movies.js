const {getDb} = require('../utils/database');
const mongodb = require('mongodb');
const { response } = require('express');


exports.createMovie = (req,res,next) => {
  try {
    const movie  = req.body;
    // const adminID = req.admin_id;
    //TODO : change later to be JWT token
    const adminID = "5ff619cc943dba71b34f0fb2";

    if( !movie["99popularity"] || !movie.director || !movie.imdb_score || !movie.name || !movie.genre.length)
    throw {
      message: "Bad Request.",
      //TODO : change all status code properly.
      status: 400
    };
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
  /*

  Req obj : {
    searchText(Text from serach bar), //TODO: check against both movie name and director name
    genres : [](all genres chosen) (if length 0 then dont apply this filter)
    sort : (field name to sort upon)(If empty don't add to aggragtion)

    //TODO : Add pagination wala fields as well.
  }

  */
  const body = req.body;
  let aggregationPipeline = [];

  //TODO : Check for search and sort filter

  //Checking for searchText field
  if(body.searchText){
    const searchText = body.searchText;
    aggregationPipeline.push({ $match: { $or: [ { "name": `${searchText}` }, { "director": `${searchText}` } ] } });
  }

  //TODO : Later make above and this below query one only by appending to it only the filters as well
  //Checking if we are filtering for genres

  //TODO : Genres selection is not working properly since choose of genre1 and genre2 
  //should result in an "and" of genres.
  if(body.genres && body.genres.length > 0){
    const genres = body.genres;
    //TODO : Later make the genre a regex so that it matches everything which is space than genre 
    //That is trimmed result should be checked.
    aggregationPipeline.push({ $match: { "genre" : { $in: genres } } });
  }

  //Checking if sort field is set
  //TODO : Later try to give functionality to sort on multiple fields and also order to sort on
  if(body.sort){
    const sortField = String(body.sort);
    console.log(sortField);
    aggregationPipeline.push({ $sort: { [sortField] : "1" } });
  }

  console.log(aggregationPipeline);

  //TODO : Check below functionality and add cursor if required
  try {
    const db = getDb();
    db.collection('movies').aggregate(aggregationPipeline).toArray()
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

exports.searchSuggestion = (req,res,next) => {
  
  //Add status code and other check if required here.

  const body = req.params.searchText;
  const regex = `^${body}`;
  const findCriteria = { $or: [ { "name": { $regex: regex  }  }, { "director": { $regex: regex }  } ] }

  

  //TODO : Check below functionality and add cursor if required
  try {
    const db = getDb();
    //TODO : Change the below find to findMany or look into it.
    db.collection('movies').find(findCriteria).toArray()
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
    const adminID = "5ff619cc943dba71b34f0fb2";

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




// exports.loadUserPosts = (req,res,next) => {
//   try {
//     const db = getDb();
//     db.collection('Posts').find({authorID : req.user_id},{projection : {
//       authorID : 0
//     }}).toArray()
//       .then((r) => {
//         res.status(200).send(r);
//       })
//       .catch((err) => {
//         console.log(err);
//         res.send(err);
//       })
//   }
//   catch (err) {
//     console.log(err);
//     res.status(err.message).send(err.status);
//   }
// }

// exports.loadOtherUserPosts = (req,res,next) => {
//   try {
//     const db = getDb();
//     console.log(req.params.userID);
//     db.collection('Posts').find({authorID : req.params.userID},{projection : {
//       authorID : 0
//     }}).toArray()
//       .then((r) => {
//         res.status(200).send(r);
//       })
//       .catch((err) => {
//         console.log(err);
//         res.send(err);
//       })
//   }
//   catch (err) {
//     console.log(err);
//     res.status(err.message).send(err.status);
//   }
// }



// exports.registerLikeForPost = (req,res,next) => {
//   try {
//     const db = getDb();
//     console.log("Request Object is ",req.body);
//     db.collection('Posts').updateOne({_id: mongodb.ObjectID(req.body.postID)},{
//       '$push' : {'likes' : req.user_id}
//     })
//       .then((r) => {
//         res.status(200).send(r);
//       })
//       .catch((err) => {
//         console.log(err);
//         res.send(err);
//       })
//   }
//   catch (err) {
//     console.log(err);
//     res.status(err.message).send(err.status);
//   }
// }



// exports.registerDislikeForPost = (req,res,next) => {
//   try {
//     const db = getDb();
//     console.log("Request Object is ",req.body);
//     db.collection('Posts').updateOne({_id: mongodb.ObjectID(req.body.postID)},{
//       '$pull' : {'likes' : req.user_id}
//     })
//       .then((r) => {
//         res.status(200).send(r);
//       })
//       .catch((err) => {
//         console.log(err);
//         res.send(err);
//       })
//   }
//   catch (err) {
//     console.log(err);
//     res.status(err.message).send(err.status);
//   }
// }



// exports.registerCommentForPost = (req,res,next) => {
//   try {
//     const db = getDb();
//     console.log("Request Object is ",req.body);
//     db.collection('Posts').updateOne({_id: mongodb.ObjectID(req.body.postID)},{
//       '$push' : {'comment' : req.body.commentMade}
//     })
//       .then((r) => {
//         res.status(200).send(r);
//       })
//       .catch((err) => {
//         console.log(err);
//         res.send(err);
//       })
//   }
//   catch (err) {
//     console.log(err);
//     res.status(err.message).send(err.status);
//   }
// }


// {
//   "_id": "5ff61dde6453731f20889bd6",
//   "99popularity": 66,
//   "director": "Rakesh Yadav",
//   "genre": [
//       " Fantasy",
//       " Romance"
//   ],
//   "imdb_score": 8.9,
//   "name": "Cool movie",
//   "admin": {
//       "name": "Admin",
//       "_id": "5ff619cc943dba71b34f0fb2"
//   }
// }