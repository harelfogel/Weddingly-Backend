const mongoose = require('mongoose' );
const consts = require('./constants' );
const { DB_HOST, DB_USER, DB_PASS } = consts;
const url = DB_HOST;

const options = {
 useNewUrlParser: true, // For deprecation warnings
 useUnifiedTopology: true, // For deprecation warnings
 user: DB_USER,
 pass: DB_PASS
};

mongoose
 .connect(url, options)  // ready function
 .then(() => console.log(('connected to DB') ))
 .catch(err => console.log((`connection error: ${err}`)));

 function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'user' to roles collection");
        });
  
        new Role({
          name: "moderator"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'moderator' to roles collection");
        });
  
        new Role({
          name: "admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }