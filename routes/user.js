const express = require('express');

const {isAuth, isAdmin} = require('../middlewares/auth-check');
const userRouter = require('../controllers/user');

const router = express.Router();


router.get('/secret/:userId', isAuth, isAdmin, (req, res, next) => {
  res.status(200).json({
    user: req.profile2
  });
});

router.param('userId', userRouter.userById);



module.exports = router;