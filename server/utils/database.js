const mongodb = require('mongodb');

const constants = require('../config/constants');

const mongoClient = mongodb.MongoClient;

let _db;

const monogoConnect = (callback) => {
  mongoClient.connect(constants.MONGOURI)
  .then((client)=>{
    console.log("Mongo DB Successfully connected!!");
    _db = client.db();
    callback(client);
  })
  .catch((err)=>{
    console.log("Error in connecting",err);
  })
}

const getDb = ()=>{
  if(_db){
    return _db;
  }
  else{
    throw 'No Database found';
  }
}

module.exports ={ 
  monogoConnect : monogoConnect,
  getDb : getDb
};