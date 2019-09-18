const { check, validationResult } = require('express-validator');
const User = require('../models/user');

const emailValidation = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;


exports.signupValidate = async (req, res, next) => {
  try{
    // await check('name', 'Field name is required.')
    // .not()
    // .isEmpty();

  await check('email')
    .not()
    .isEmpty()
    .withMessage('Email is required.')
    .matches(emailValidation)
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(user => {
        if(user){
          return Promise.reject('Email exists already. Please pick a different one.');
        }
      });
    });

    // await check('password', 'Password is required.')
    // .not()
    // .isEmpty()
    // .isLength({ min: 6 })
    // .withMessage('Password must contains at least 6 characters.')
    // .matches(/\d/)
    // .withMessage('Password must contain with only numbers and text and at least 6 characters.');
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      const err = new Error('Validation failed.');
      err.statusCode = 422;
      err.data = errors.array()[0].msg;
      throw err; 
    }

    next();
  } catch(err){
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  }
}