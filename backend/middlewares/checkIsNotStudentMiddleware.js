const UserModel = require('../models/UserModel')

module.exports = async (req, res, next) => {

  if (!req.user) {
    return res.json({
      code: '1013',
      msg: 'Unauthorized: No user data found',
      data: null
    })
  }

  const user = await UserModel.findById(req.user._id)
  if (!user) {
    return res.json({
      code: '1011',
      msg: 'User not found',
      data: null
    })
  }

  if (user.rol == 'student') {
    return res.json({
      code: '1016',
      msg: 'Access denied: student has not permission',
      data: null
    })
  }

  next()
}