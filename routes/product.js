const express = require('express');
const router = express.Router();

// Import Controller
const productController = require('../controllers/product');
const userController = require('../controllers/user');

// Check Role
const { isAuth, isAdmin } = require('../middlewares/auth-check');

// Route path
router.post('/product/create', isAuth, isAdmin, productController.create);
router.get('/product/:productId', isAuth, productController.read);
router.delete('/product/:productId', isAuth, productController.remove);
router.put('/product/:productId', isAuth, productController.update);

router.param('userId', userController.userById);
// router.param('productId', productController.productById);

module.exports = router;