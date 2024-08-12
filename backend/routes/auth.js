var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const {secret} = require('../config/config');
const UserModel = require('../models/UserModel');
const TokenModel = require('../models/TokenModel');
const checkTokenMiddleware = require('../middlewares/checkTokenMiddleware');
const bcrypt = require('bcrypt');

router.post('/reg', async (req, res) => {
  const userInfo = req.body;
  let rol;
  const {password, confirmPassword ,email ,admin} = userInfo;

  if(email.endsWith('@alumnos.upm.es')){
    rol = "student";
  }else if(email.endsWith('@upm.es')){
    console.log(admin)
    if(admin === true || admin === "true") {
      rol = "admin"
    }
    else {
      rol = "professor"
    }

  }else{
    return res.json({
      code: '1001',
      msg: 'Email must end with @alumnos.upm.es or @upm.es',
      data: null
    });
  }

  if(password !== confirmPassword){
    return res.json({
      code: '1005',
      msg: 'The two passwords are inconsistent',
      data: null
    });
  }

  const existingUsername = await UserModel.findOne({username:userInfo.username });
  if (existingUsername) {
    return res.json({
      code: '1006',
      msg: 'Username already exists',
      data: null
    });
  }

  const existingEmail = await UserModel.findOne({email:userInfo.email});
  if (existingEmail) {
    return res.json({
      code: '1007',
      msg: 'Email already exists',
      data: null
    });
  }

  try {
    delete userInfo.confirmPassword;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({...userInfo, password:hashedPassword, rol:rol});

    res.json({
      code: '0000',
      msg: 'Registration success',
      data: user
    });
    
  } catch (err) {
    res.json({
      code: '1002',
      msg: 'Registration failed, please try again later',
      data: null
    });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.json({
        code: '1003',
        msg: 'Incorrect username',
        data: null
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.json({
        code: '1003',
        msg: 'Incorrect password',
        data: null
      });
    }

    const token = jwt.sign({
      username: user.username,
      _id: user._id
    }, secret, {
      expiresIn: 60 * 60
    });

    res.json({
      code: '0000',
      msg: 'login successful',
      data: {
        rol: user.rol,
        username: user.username,
        token: token
      }
    });

  } catch (err) {
    console.log(err)
    res.json({
      code: '1004',
      msg: 'Database read failed',
      data: null
    });
  }
});

router.post('/logout', checkTokenMiddleware, async (req, res) => {

  try {

    const authHeader = req.get('Authorization');
    const token = authHeader.substring(7);
    await TokenModel.create({ token: token});

    res.json({
      code: '0000',
      msg: 'Logout successful',
      data: null
    });
  } catch (err) {
    console.error('Error while logging out:', err);
    res.json({
      code: '1005',
      msg: 'Logout failed',
      data: null
    });
  }
});

module.exports = router;
