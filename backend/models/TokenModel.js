
const mongoose = require('mongoose');

let blacklistedTokenSchema  = new mongoose.Schema({

    token: {
        type: String,
        required: true
      },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60*60
      }

});

let TokenModel = mongoose.model('tokens', blacklistedTokenSchema );

module.exports = TokenModel;