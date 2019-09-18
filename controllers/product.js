const fs = require('fs');
const formidable = require('formidable');
const _ = require('lodash');

const Product = require('../models/product');


exports.productById = (req, res, next) => {
  const _id = req.query._id;
  Product.findById(_id).exec((err, product) => {
    if(err || !product){
      return res.status(400).json({
        error: 'Product not found.'
      });
    }

    req.product = product;
    next();
  });
}

exports.create = (req, res, next) => {
  const form = new formidable.IncomingForm();
  // form.uploadDir = "/public/images";
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if(err){
      return res.status(400).json({ 
        error: 'Image could not be uploaded.'
      });
    }

    const {
      name,
      description,
      price,
      quantity,
      shipping,
      category
    } = fields;

    if(!name || !description || !price || !quantity || !shipping || !category) {
      return res.status(400).json({
        error: 'All fields are required.'
      });
    }

    let product = new Product(fields);
    if(files.photo){

      if(files.photo.size > 1000000){
        return res.status(400).json({ 
          error: 'Image should be less than 1mb in size.'
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if(err) {
        console.log('Save product error ', err);
        return res.status(400).json({ 
          error: 'Save product error ', err
        });
      }

      res.status(201).json(result);
    });
  });
};

exports.read = (req, res, next) => {
  const _id = req.params.productId;
  Product.findById(_id)
    .then(product => {
      if(!product){
        const error = new Error('Product not found.');
        error.statusCode = 400;
        throw error;
      }
      res.status(200).json(product);
    })
    .catch(error => {
      if(!error.statusCode){
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.remove = (req, res, next) => {
  const _id = req.params.productId;
  Product.findByIdAndRemove(_id)
    .then(delProduct => {
      res.status(200).json({
        message: 'Product deleted successfully.',
        product: delProduct
      });
    })
    .catch(error => {
      if(!error.statusCode){
        error.statusCode = 500;
      }
      next(error);
    });
};


exports.update = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if(err){
      return res.status(400).json({ 
        error: 'Image could not be uploaded.'
      });
    }

    const {
      name,
      description,
      price,
      quantity,
      shipping,
      category
    } = fields;

    if(!name || !description || !price || !quantity || !shipping || !category) {
      return res.status(400).json({
        error: 'All fields are required.'
      });
    }

    let product = new Product(fields);
    // let product = req.product;
    // let product = _.extend(prodcut, fields);

    if(files.photo){

      if(files.photo.size > 1000000){
        return res.status(400).json({ 
          error: 'Image should be less than 1mb in size.'
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if(err) {
        console.log('Save product error ', err);
        return res.status(400).json({ 
          error: 'Save product error ', err
        });
      }

      res.status(201).json(result);
    });
  });
};
