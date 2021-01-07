const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const constants = require('../config/constants');

const {getDb} = require('../utils/database');

exports.protected = (req,res,next) =>{
  res.send("Hello user");
}

exports.signUp = async (req, res, next) => {
  try {
    const { name, email, password ,profilePic} = req.body;
    if (!name || !email || !password)
      throw {
        message: "Require name,email and password for signup.",
        status: 422
      };
    const db = getDb();
    const isEmailExists = await db.collection('Users').findOne({ email: email });
    if (isEmailExists)
      throw {
        message: "Email already exists.",
        status: 403
      };
    //Hasing the password using bcrypt
    bcrypt.hash(password, 12)
      .then((hashedPassword) => {
        return db.collection('Users').insertOne({
          name,
          email,
          password: hashedPassword,
          profilePic,
          followers : [],
          following : [],
          description : ""
        });
      })
      .then((r) => {
            return res.status(200).send("Signup Successful.");
      })
      .catch((err) => {
        console.log("Error in hashing password");
        throw {
          message: "Internal Server error.",
          status: 500
        };
      })
  }
  catch (err) {
    console.log(err);
    res.status(err.message).send(err.status);
  }
}

exports.signIn = (req,res,next) => {
  try{
    const {email , password} = req.body;
    if (!email || !password)
      throw {
        message: "Require name,email and password for signup.",
        status: 422
      };
    const db = getDb();
    let userDetails;
    db.collection('Users').findOne({ email: email })
      .then((userInfo)=>{
        if (!userInfo)
          throw {
            message: "No account for this email",
            status: 403
          };
        console.log("user Info",userInfo);
        userDetails = userInfo;
        const hashedPassword = userInfo.password;
        return bcrypt.compare(password , hashedPassword)
        })
        .then((isMatch)=>{
          if(isMatch){
            //CREATING JWT
            const dirName = path.dirname(__dirname);
            //const privateKey = fs.readFileSync(dirName + '/utils/private.pem','utf-8');
            const privateKey = constants.privateKey;
            const token = jwt.sign({_id : userDetails._id},privateKey);
            const userDetailsToBeSend = {
              _id : userDetails._id,
              name : userDetails.name,
              email : userDetails.email
            }
            return res.status(200).json(
              {
                token,
                userDetails : userDetailsToBeSend
              }
            );
          }
          else{
            throw {
              message: "Incorrect Password.",
              status: 401
            };
          }
        })
        .catch((err)=>{
          console.log("Error in checking for email existence.") 
          console.log(err);
          res.status(err.message).send(err.status);
        }) 
  }
  catch (err) {
    console.log(err);
    res.status(err.message).send(err.status);
  }
}