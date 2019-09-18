const Category = require('../models/category');

exports.create = (req, res, next) => {
  const category = new Category(req.body);
  category
    .save()
    .then(resp => {
      res.status(201).json({ msg: resp });
    })
    .catch(error => {
      if(!error.statusCode){
        error.statusCode = 500;
      }
      next(error);
    });
};