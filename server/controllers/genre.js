const {getDb} = require('../utils/database');
const mongodb = require('mongodb');
const { response } = require('express');


exports.createGenre = (req,res,next) => {
  try {
    const {genre}  = req.body;
    // const adminID = req.admin_id;
    //TODO : change later to be JWT token
    const adminID = "5ff619cc943dba71b34f0fb2";

    
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