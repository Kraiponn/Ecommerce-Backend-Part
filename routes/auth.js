const express = require('express');
const { body, check } = require('express-validator');
const User = require('../models/user');

const { isAuth } = require('../middlewares/auth-check');
const authController = require('../controllers/auth');

const router = express.Router();
const emailValidation = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;



router.get('/', isAuth, (req, res, next) => {
  User.find().then(user => {
    console.log('findOne ', user);
    return res.status(200).json({ msg: user });
  })
  .catch(error => {
    if(!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  });
});

// Sign Up
router.post('/signup',
 [
  body('name', 'Field name is required.')
    .not()
    .isEmpty(),
  check('email')
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
    })
  ,
  body('password', 'Password is required.')
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must contains at least 6 characters.')
    .matches(/\d/)
    .withMessage('Password must contain with only numbers and text and at least 6 characters.')
 ], authController.signup);


 router.post('/signin',
 [
  check('email')
    .not()
    .isEmpty()
    .withMessage('Email is required.')
    .matches(emailValidation)
    .withMessage('Pleae enter a valid email format.')
  ,
  body('password', 'Password is required.')
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must contains at least 6 characters.')
    .matches(/\d/)
    .withMessage('Password must contain with only numbers and text and at least 6 characters.')
 ]
 , authController.signin);

//  Sign Out
 router.post('/signout', authController.signout);

//  Request new token
router.post('/token', authController.token);


module.exports = router;