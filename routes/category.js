const express = require('express');
const router = express.Router();

// Import Category Controller
const categoryController = require('../controllers/category');

// Check Role
const { isAuth, isAdmin } = require('../middlewares/auth-check');

// Route path
router.post('/category/create', isAuth, isAdmin, categoryController.create);

module.exports = router;