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
    bcrypt.hash(password, 8)
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
    const {name , password} = req.body;
    if (!name || !password)
      throw {
        message: "Require name and password for login.",
        status: 422
      };
    const db = getDb();
    let adminDetails;
    db.collection('admins').findOne({ name: name })
      .then((adminInfo)=>{
        if (!adminInfo)
          throw {
            message: "No account for this name",
            status: 403
          };
        console.log("admin Info",adminInfo);
        adminDetails = adminInfo;
        const hashedPassword = adminInfo.password;
        return bcrypt.compare(password , hashedPassword)
        })
        .then((isMatch)=>{
          if(isMatch){
            //CREATING JWT
            const dirName = path.dirname(__dirname);
            //const privateKey = fs.readFileSync(dirName + '/utils/private.pem','utf-8');
            const privateKey = constants.privateKey;
            const token = jwt.sign({_id : adminDetails._id},privateKey);
            const adminDetailsToBeSend = {
              _id : adminDetails._id,
              name : adminDetails.name
            }
            return res.status(200).json(
              {
                token,
                adminDetails : adminDetailsToBeSend
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
          console.log("Error in checking for name existence.") 
          console.log(err);
          res.status(err.message).send(err.status);
        }) 
  }
  catch (err) {
    console.log(err);
    res.status(err.message).send(err.status);
  }
}