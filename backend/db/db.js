
module.exports = function (success, error) {
  
  if(typeof error !== 'function'){
    error = () => {
      console.log('Connection failed');
    }
  }
  
  const mongoose = require('mongoose');

  const {DBHOST, DBPORT, DBNAME} = require('../config/config.js');

  mongoose.set('strictQuery', true);
                 
  mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);

  mongoose.connection.once('open', () => {
    success();
  });


  mongoose.connection.on('error', () => {
    error();
  });


  mongoose.connection.on('close', () => {
    console.log('connection closed');
  });
}