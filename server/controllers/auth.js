const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const constants = require('../config/constants');

const {getDb} = require('../utils/database');
const {validateString} = require('../utils/validator');

exports.signUp = async (req, res, next) => {
  try {
    const { name, password} = req.body;

    if (!name || !password)
      throw {
        data : null,
        message: "Require name and password for signup.",
        status: 400
      };
    //Validate admin name
    isNameValidated = validateString(name , {"max" : 60, "min" : 3, "charsNotAllowed" : ['_','@','/','\\','&'] });
    if(!isNameValidated.isValidate){
      throw {
        data : null,
        message : `${isNameValidated.message} : name`,
        status : 400
      }
    }
    //Validate admin password
    isPasswordValidated = validateString(password , {"max" : 60, "min" : 5 });
    if(!isPasswordValidated.isValidate){
      throw {
        data : null,
        message : `${isPasswordValidated.message} : password`,
        status : 400
      }
    }

    
    const db = getDb();
    const isNameExists = await db.collection('admins').findOne({ name: name });
    if (isNameExists)
      throw {
        data : null,
        message: "Admin name already exists.",
        status: 400
      };
    //Hasing the password using bcrypt
    bcrypt.hash(password, 8)
      .then((hashedPassword) => {
        return db.collection('admins').insertOne({
          name,
          password: hashedPassword
        });
      })
      .then((r) => {
        console.log("Response is",r);
        let respObj = {
          data : r.insertedId,
          message : "Admin added successfully",
          status : 200
        }
        return res.status(200).json(respObj);
      })
      .catch((err) => {
        return res.status(err.status).json(err);
      })
  }
  catch (err) {
    console.log(err);
    return res.status(err.status).json(err);
  }
}

exports.logIn = (req,res,next) => {
  try{
    const {name , password} = req.body;
    if (!name || !password)
      throw {
        data : null,
        message: "Require name and password for login.",
        status: 400
      };
    //Validate admin name
    isNameValidated = validateString(name , {"max" : 60, "min" : 3, "charsNotAllowed" : ['_','@','/','\\','&'] });
    if(!isNameValidated.isValidate){
      throw {
        data : null,
        message : `${isNameValidated.message} : name`,
        status : 400
      }
    }
    //Validate admin password
    isPasswordValidated = validateString(password , {"max" : 60, "min" : 5 });
    if(!isPasswordValidated.isValidate){
      throw {
        data : null,
        message : `${isPasswordValidated.message} : password`,
        status : 400
      }
    }

    const db = getDb();
    let adminDetails;
    db.collection('admins').findOne({ name: name })
      .then((adminInfo)=>{
        if (!adminInfo)
          throw {
            data : null,
            message: "No admin found.",
            status: 401
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
            let respObj = {
              data : {
                token,
                adminDetails : adminDetailsToBeSend
              },
              message : "Login successful.",
              status : 200
            }
            return res.status(200).json(respObj);
          }
          else{
            throw {
              data : null,
              message: "Incorrect Password.",
              status: 401
            };
          }
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