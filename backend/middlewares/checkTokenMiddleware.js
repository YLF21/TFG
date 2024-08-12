const jwt = require('jsonwebtoken');
const {secret} = require('../config/config');
const TokenModel = require('../models/TokenModel');
module.exports = async (req, res, next) => {

  const authHeader = req.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({
      code: '1008',
      msg: 'Token is missing or format is incorrect',
      data: null
    })
  }

  const token = authHeader.substring(7);
  const tokenInBlacklist = await TokenModel.findOne({ token: token });
  if (tokenInBlacklist) {
    return res.json({
      code: '1010',
      msg: 'Token has been blacklisted',
      data: null
    });
  }

  jwt.verify(token, secret, (err, data) => {

    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.json({
          code: '1011',
          msg: 'Token expired',
          data: null
        })
      } else {
        return res.json({
          code: '1009',
          msg: 'Token verification failed',
          data: null
        })
      }
    }

    req.user = data;
    next();
  });

}