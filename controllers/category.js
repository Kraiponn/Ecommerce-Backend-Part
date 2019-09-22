const Category = require('../models/category');
const { validationResult } = require('express-validator');


// Added new category
exports.create = async (req, res, next) => {
  try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      // console.log(errors.array());
      const err = new Error(errors.array()[0].msg);
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }

    const category = new Category(req.body);
    const result = await category.save();
    res.status(200).json({ 
      msg: 'Added category successfully.',
      data: result
    });
  }catch(error){
    if(!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  }
};

// Fetch category by Id
exports.fetchById = async (req, res, next) => {
  try{
    const _id = req.params.categoryId;
    const category = await Category.findById(_id);
    if(!category){
      const error = new Error('Category not found!');
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({ data: category });
  } catch(error){
    if(!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  }
};

// Fetch All category
exports.fetchAll = async (req, res, next) => {
  try{
    const category = await Category.find();
    if(!category){
      const error = new Error('Category not found!');
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({ data: category });
  } catch(error){
    if(!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  }
};

// Edited category by Id
exports.edited = async (req, res, next) => {
  try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      const err = new Error(errors.array()[0].msg);
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }

    const _id = req.params.categoryId;
    const category = await Category.findByIdAndUpdate(_id, req.body);
    if(!category){
      const err = new Error('Category not found!');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({ 
      msg: 'Updated category successfully.',
      data: category
    });
  }catch(error){
    if(!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  }
};

// Deleted category by Id
exports.removed = async (req, res, next) => {
  try{
    const _id = req.params.categoryId;
    const category = await Category.findByIdAndDelete(_id);
    if(!category){
      const err = new Error('Category not found!');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({ 
      msg: 'Deleted category successfully.',
      data: category
    });
  }catch(error){
    if(!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  }
};