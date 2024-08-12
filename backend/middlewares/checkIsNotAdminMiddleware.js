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

  if (user.rol == 'admin') {
    return res.json({
      code: '1014',
      msg: 'No permission',
      data: null
    })
  }

  next()
}