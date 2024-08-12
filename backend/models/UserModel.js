
const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({

  username:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  rol:{
    type: String,
    enum: ['student','professor','admin']
  },
  email:{
    type: String,
    required: true,
    unique: true
  }

});

let UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
