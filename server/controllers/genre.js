const {getDb} = require('../utils/database');
const mongodb = require('mongodb');
const { response } = require('express');
const {validateString} = require('../utils/validator');


exports.createGenre = (req,res,next) => {
  try {
    const {genre}  = req.body;
    // const adminID = req.admin_id;
    //TODO : change later to be JWT token
    const adminID = req.adminID;
    if(!genre)
    throw {
      message: "All fields(genre) required.",
      //TODO : change all status code properly.
      status: 400
    };
    //Validate all fields

    //Validate genre name
    isNameValidated = validateString(genre , {"max" : 50, "min" : 3, "charsNotAllowed" : ['_','@','/','\\','&'] });
    if(!isNameValidated.isValidate){
      throw {
        message : `${isNameValidated.message} : genre`,
        status : 400
      }
    }
    
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
        return db.collection('genres').insertOne({
          genreName : genre
        })
      })
      .then((r)=>{
        res.status(200).send("Genre added successfully");
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

exports.loadAllGenre = (req,res,next) => {
  //TODO : Check below functionality and add cursor if required
  try {
    const db = getDb();
    db.collection('genres').find({}).toArray()
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