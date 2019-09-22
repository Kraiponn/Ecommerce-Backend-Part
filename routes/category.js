const { body } = require('express-validator');
const express = require('express');
const router = express.Router();

// Import Category Controller
const controllers = require('../controllers/category');

// Check Role
const { isAuth, isAdmin } = require('../middlewares/auth-check');


/**************************************************************
                    Define Route
**************************************************************/
// Create new category
router.post('/', 
  isAuth, 
  isAdmin,
  [
    body('name', 'Field name is required.')
      .not()
      .isEmpty()
  ],
  controllers.create
);

// Edited category with Id
router.put('/:categoryId', 
  isAuth, 
  isAdmin,
  [
    body('name', 'Field name is required.')
      .not()
      .isEmpty()
  ],
  controllers.edited
);

// Fetch category with Id
router.get('/:categoryId', controllers.fetchById);

// Fetch all category
router.get('/', controllers.fetchAll);

// Removed category with Id
router.delete('/:categoryId', controllers.removed);


module.exports = router;