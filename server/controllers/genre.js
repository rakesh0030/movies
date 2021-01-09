const {getDb} = require('../utils/database');
const mongodb = require('mongodb');
const { response } = require('express');
const {validateString} = require('../utils/validator');


exports.createGenre = (req,res,next) => {
  try {
    const {genre}  = req.body;
    const adminID = req.adminID;
    if(!genre)
    throw {
      data : null,
      message: "All fields(genre) required.",
      status: 400
    };
    //Validate all fields

    //Validate genre name
    isNameValidated = validateString(genre , {"max" : 50, "min" : 3, "charsNotAllowed" : ['_','@','/','\\','&'] });
    if(!isNameValidated.isValidate){
      throw {
        data : null,
        message : `${isNameValidated.message} : genre`,
        status : 400
      }
    }
    
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
      .then(async (adminName)=>{
        const isNameExists = await db.collection('genres').findOne({ genreName: genre });
        if (isNameExists)
          throw {
            data: null,
            message: "Genre name already exists.",
            status: 400
          };
        return db.collection('genres').insertOne({
          genreName : genre
        })
      })
      .then((r)=>{
        let respObj = {
          data : r.insertedId,
          message : "Genre added successfully",
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

exports.loadAllGenre = (req,res,next) => {
  try {
    const db = getDb();
    db.collection('genres').find({}).toArray()
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