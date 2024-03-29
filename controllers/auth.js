const User = require('../models/user');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { options } = require('../routes/auth');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async(req, res, next) => {
  const {name, email, password, role} = req.body;

  const user = await User.create({
    name, email, password, role
  })

  sendTokenResponse(user, 200, res);

})

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async(req, res, next) => {
  const {email, password} = req.body;

  if(!email || !password){
    return next(new ErrorResponse('Please enter an email and password', 400));
  }

  const user = await User.findOne({email}).select('+password');

  if(!user){
    return next(new ErrorResponse('Invalid credentials', 401))
  }
  
  const isMatch = await user.matchPassword(password);
  if(!isMatch){
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);

  
})

// @desc    Get Logged User
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async(req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  })
})


// Get user from model, create token and send cookie response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  if(process.env.NODE_ENV === 'production'){
    options.secure = true;
  }

  res
  .status(statusCode)
  .cookie('token', token, options)
  .json({
    success: true,
    token
  })
}