const User = require('../models/user');
const Joi = require('@hapi/joi');


/**
 * Method validation for user
 */
const validation = user => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
    repeat_password: Joi.ref('password')
  }); 

  return schema.validate(user);
};


exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if(err || !user){
      return res.status(400).json({ 
        error: 'User not found.'
      });
    }

    // console.log('userById ', user);
    req.profile2 = user;
    next();
  });
};

 
/**
 * Fetch user by Id
 */
exports.fetchById = async (req, res, next) => {
  console.log('Fetch by id');

  try{
    const user = await User.findById(req.params.userId);
    if(!user){
      const err = new Error('Your user not found.');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({
      data: user
    });
  }catch(error){
    if(!error.statusCode){
      error.statusCode = 500;
    }
  }
};


/**
 * Fetch updated user by Id
 */
exports.editedById = async (req, res, next) => {
  try{
    const { error } = validation(req.body);
    // console.log(error.details[0].message);

    if(error) {
      const err = new Error(error.details[0].message);
      err.statusCode = 400;
      throw err;
    }
    // console.log('no error ', error);
    // res.status(200).json({ msg: 'OK OK ', error });

    const _id = req.params.userId;
    const user = await User.findByIdAndUpdate(_id, {$set: req.body});
    if(!user){
      const err = new Error('Your user not found.');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({
      msg: 'Updated user successfully.',
      data: user
    });
  }catch(error){
    if(!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  }
};


/**
 * Fetch all users fron collection
 */
exports.fetchAll = async (req, res, next) => {
  // console.log('Fetch all >>>');
  // res.status(200).json({
  //   data: 'Oh no!'
  // });

  try{
    const user = await User.find();
    if(!user){
      const err = new Error('User not found.');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({
      data: user
    });
  }catch(error){
    if(!error.statusCode){
      error.statusCode = 500;
    }
  }
};