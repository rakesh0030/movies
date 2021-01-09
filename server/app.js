const express = require('express');
// const cors = require('cors');

//password = dbUserPassword

const db = require('./utils/database');
const path = require('path');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const genreRoutes = require('./routes/genre');
// const userDetailsRoutes = require('./routes/user');


const app = express();

app.use(express.json());

// app.use(cors())

app.use('/api/auth',authRoutes);
app.use('/api/movies',movieRoutes);
app.use('/api/genres',genreRoutes);

//404 route
app.use((req,res,next)=>{
  let respObj = {
    data : null,
    message : `${req.method} Route ${req.url} not found.`,
    status : 404
  }
  res.status(404).json(respObj);
})
// app.use('/user/',userDetailsRoutes);

// app.get('/',middleware,(req,res,next)=>{
//   res.json("Hello word");
//   next();
// })

let port = process.env.PORT || 8000;

if(process.env.NODE_ENV == "production"){
  app.use(express.static('client/build'));
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'));
  })
}

db.monogoConnect((resp)=>{
  // console.log("Response is",resp);
  app.listen(port,()=>{
    console.log('server running on port ',port);
  })
})