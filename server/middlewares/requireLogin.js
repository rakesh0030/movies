const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const constants = require('../config/constants');

const dirName = path.dirname(__dirname);

const requireLogin = (req,res,next) => {
  //const privateKey = fs.readFileSync(dirName + '/utils/private.pem');
  const privateKey = constants.privateKey;
  console.log("Req header is ",req.headers);
  if (typeof req.headers.authorization !== "undefined") {
    // retrieve the authorization header and parse out the
    // JWT using the split function
    let token = req.headers.authorization;
    // Here we validate that the JSON Web Token is valid and has been 
    // created using the same private pass phrase
    jwt.verify(token, privateKey, (err, admin) => {
        
        // if there has been an error...
        if (err) {  
            // shut them out!
            res.status(500).json({ error: "You must be logged in." });
        }
        else{
          // if the JWT is valid, allow them to hit
          // the intended endpoint
          req.adminID = admin._id;
          return next();
        }
    });
} else {
    // No authorization header exists on the incoming
    // request, return not authorized and throw a new error 
    res.status(500).json({ error: "Not Authorized" });
}
}

const isLoggedIn = (req,res,next) =>{
  console.log("Request Auth header",req.headers.authorization);
  return typeof req.headers.authorization !== "undefined" ? requireLogin(req,res,next) : next();
}

module.exports = {
  requireLogin,
 isLoggedIn 
};