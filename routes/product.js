const express = require('express');
const multer = require('multer');

const router = express.Router();

// Import Controller
const controllers = require('../controllers/product');

// Check Role
const { isAuth, isAdmin } = require('../middlewares/auth-check');

// Initial and config parameters
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/imgs');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFiltered = (req, file, cb) => {
  if(
    file.mimetype === 'image/jpeg' || 
    file.mimetype === 'image/png' || 
    file.mimetype === 'jpg') {
      cb(null, true);
    }
  else {
    cb(null, false);
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFiltered,
  limits: {
    fileSize: 1000000
  }
});


/**************************************************************
                    Define Router
**************************************************************/

// Added new product
router.post('/', 
  isAuth, 
  isAdmin, 
  upload.single('image_path'),
  controllers.createdProduct
);


// Fetch product by sort field and orderBy
router.get('/by-query', controllers.list);

// Fetch product by Id
router.get('/by-id/:productId', controllers.fetchById);

// Fetch product by related
router.get('/related/:productId', controllers.fetchRelated);

// Fetch all product
router.get('/all', controllers.fetchAll);

// Fetch category in Product
router.get('/category', controllers.fetchCategories)

// Fetch product by search condition
router.post('/by/search', controllers.fetchBySearch);

// Edited product by Id
router.put('/:productId', 
  isAuth, 
  isAdmin,
  upload.single('image_path'),
  controllers.updated
);

// Deleted product by Id
router.delete('/:productId', 
  isAuth, 
  isAdmin, 
  controllers.deleted
);





// router.param('userId', userController.userById);
// router.param('productId', controllers.productById);

module.exports = router;