const fs = require('fs');
// const path = require('path');
// const formidable = require('formidable');
// const _ = require('lodash');

const Product = require('../models/product');

/************************************************** 
 * sell / arrival
 * by sell = /product?sortBy=sold&order=desc&limit=4
 * by arrival = /product?sortBy=createdAt&order=desc&limit=4
 * if no param are send, then all product are returned. 
*/

exports.list = async (req, res, next) => {
  let order = req.query.orderby ? req.query.orderby : 'asc';
  let sortBy = req.query.sortby ? req.query.sortby : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  // console.log(order, sortBy, limit);

  try{
    const product = await Product.find()
                      .select('-image_path')
                      .populate('category')
                      // .sort([[sortBy, order]])
                      .sort([ [sortBy, order] ])
                      .limit(limit);
    if(!product){
      const err = new Error('Could not find product.');
      err.statusCode = 400;
      throw err;
    }

    // console.log(product)
    res.status(200).json({ data: product });
  } catch(err) {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  }
};

// Fetch product by Id
exports.fetchById = async (req, res, next) => {
  try {
    const _id = req.params.productId;
    const product = await Product.findById(_id);
    if(!product) {
      const err = new Error('Product not found.');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({ data: product });
  } catch(err) {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


/************************************************** 
 * Fetch list product by search
 * we will implement product search in react fontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clickes on those checkbox and radio buttons
 * we will make api requst and show the products to users based on what he wants
*/
exports.fetchBySearch = async (req, res, next) => {
  let orderBy = req.body.orderby ? req.body.orderby : 'desc';
  let sortBy = req.body.sortby ? req.body.sortby : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  try{
    for(let key in req.body.filters) {
      if(req.body.filters[key].length > 0) {
        if(key === 'price') {
          // gte - greater than price [0-10]
          // lte - less than
          findArgs[key] = {
            $gte: req.body.filters[key][0],
            $lte: req.body.filters[key][1]
          };
        } else {
          findArgs[key] = req.body.filters[key];
        }
      }
    }

    const product = await Product.find(findArgs)
      .select('-image_path')
      .populate('category')
      .sort([[ sortBy, orderBy ]])
      .skip(skip)
      .limit(limit);
    
    if(!product) {
      const err = new Error('Products not found.');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({ 
      size: data.length, 
      data: product 
    });
  } catch(error) {
    if(!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

// Fetch product by Id
exports.fetchAll = async (req, res, next) => {
  try {
    const product = await Product.find();
    if(!product) {
      const err = new Error('Product not found.');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({ data: product });
  } catch(err) {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

/**
 * Fetch product related
 * It will find the products base on the req product categoty
 * Other products that has the some category, will be return
 */
exports.fetchRelated = async (req, res, next) => {
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    
    const product = await Product.findById(req.params.productId);
    if(!product) {
      const err = new Error('Product not found.');
      err.statusCode = 400;
      throw err;
    }

    const result = await Product.find({ 
      _id: {$ne: product}, 
      category: product.category
    })
    .limit(limit)
    .populate('categry', '_id name');
    
    if(!result) {
      const err = new Error('Could not find product.');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({ data: result });
  } catch(err) {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


/**
 * Find all categories in Product
 */
exports.fetchCategories = async (req, res, next) => {
  try {
    const category = await Product.distinct('category', {});
    if(!category) {
      const err = new Error('Category not found.');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({ data: category });
  } catch(err) {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


// Added new product
exports.createdProduct = async (req, res, next) => {
  const {
    name,
    sold,
    description,
    price,
    quantity,
    shipping,
    category
  } = req.body;

  try {
    if(!req.file){
      const error = new Error('No image pick');
      error.statusCode = 400;
      throw error;
    }
    
    // console.log(req.file);
    const imgPath = req.file.path;
    const proData = {
      name: name,
      sold: sold,
      description: description,
      price: price,
      quantity: quantity,
      shipping: shipping,
      category: category,
      image_path: imgPath
    };
    // console.log(proData);

    const product = new Product(proData);
    const resp = await product.save();
    res.status(201).json({
      msg: 'Product added successfully',
      data: resp
    });
  } catch(error){
    if(!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};


// Edited product by Id
exports.updated = async (req, res, next) => {
  try {
    const _id = req.params.productId;
    let imagePath = req.body.image_path;

    if(req.file){
      imagePath = req.file.path;
    }

    if(!imagePath){
      const error = new Error('No file picked.');
      error.statusCode = 422;
      throw error;
    }

    const data = {
      name: req.body.name,
      sold: req.body.sold,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      shipping: req.body.shipping,
      category: req.body.category,
      image_path: imagePath
    };
    
    const product = await Product.findByIdAndUpdate(_id, data);
    if(!product){
      clearImage(imagePath);
      const error = new Error('Could not find this product for update.');
      error.statusCode = 422;
      throw error;
    }else{
      clearImage(product.image_path);
    }

    // if(imagePath !== product.image_path){
    //   clearImage(product.image_path);
    // }

    res.status(200).json({
      msg: 'Product updated successfully.',
      data: product
    });
  } catch(error){
    if(!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};


// Deleted product by Id
exports.deleted = async (req, res, next) => {
  const id = req.params.productId;

  try {
    // const product = await Product.remove({_id: id}, {single: true});
    const product = await Product.findOneAndDelete({ _id: id });
    if(!product) {
      const err = new Error('Product not found.');
      err.statusCode = 400;
      throw err;
    }
    console.log('Product ', product);
    const imgPath = product.image_path;
    clearImage(imgPath);

    res.status(200).json({
      msg: 'Product deleted successfully.',
      data: product
    });
  } catch(error){
    if(!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}



// Remove image from path
const clearImage = imgPath => {
  // console.log('Clear image ' + imgPath);
  fs.unlink(imgPath, (err) => console.log(err));
};
