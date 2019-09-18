const User = require('../models/user');
const bcrypt = require('bcryptjs');
const config = require('config');

const { validationResult } = require('express-validator');
const tokenList = {};


exports.signup = async (req, res, next) => {
  const {name, email, password} = req.body;
  // console.log(req.body, ' -- ' + email);

  try{
    const errors = validationResult(req);
    // console.log(errors);

    if(!errors.isEmpty()){
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array()[0].msg;
      throw error;
    }

    const hashPwd = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      password: hashPwd
    });

    const docUser = await user.save();
    res.status(201).json({ 
      msg: 'Created new user successfully.',
      user: docUser
   });
  } catch(err){
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      const error = new Error('Log in failed.');
      error.statusCode = 422;
      error.data = errors.array()[0].msg;
      throw error;
    }

    const userDoc = await User.findOne({ email: email });
    if(!userDoc){
      const error = new Error('a user with that email could not be found.');
      error.statusCode = 401;
      throw error;
    }

    const isPwdMatch = await bcrypt.compare(password, userDoc.password);
    if(!isPwdMatch){
      const error = new Error('Wrong password.');
      error.statusCode = 401;
      throw error;
    }

    const payload = {
      userId: userDoc._id,
      email: userDoc.email,
      role: userDoc.role
    };
    // console.log('TokenSecret ', config.get('tokenSecret'));

    const token = userDoc.generateToken(
      payload, 
      config.get('tokenSecret'), 
      config.get('tokenLife')
    );

    const refreshToken = userDoc.generateToken(
      payload, 
      config.get('refreshTokenSecret'), 
      config.get('refreshTokenLife')
    );

    const resp = {
      token: token,
      refreshToken: refreshToken,
      user: userDoc,
      msg: 'Created user successfully.'
    }

    tokenList[refreshToken] = resp;
    tokenList['others'] = 'my name is ksn-development';

    res.status(200).json(resp);
  }catch(err){
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.signout = (req, res, next) => {
  const postData = req.body;
  delete tokenList[postData.refreshToken];

  // console.log(tokenList[postData.refreshToken].refreshToken);
  // console.log(tokenList[postData.refreshToken].token);
  console.log(tokenList);
  res
    .status(200)
    .json({ 
      msg: 'Signout successfully.'
  });
}

exports.token = (req, res, next) => {
  const postData = req.body;
  if((postData.refreshToken) && (postData.refreshToken in tokenList)){
    const user = {
      userId: postData.userId,
      email: postData.email
    }
    
    const token = User.generateToken(
      user,
      config('tokenSecret'),
      config('tokenLife')
    );

    tokenList[postData.refreshToken].token = token;
    res.status(200).json({
      token: token
    });
  }
}


