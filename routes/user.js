const express = require('express');

const {isAuth, isAdmin} = require('../middlewares/auth-check');
const userRouter = require('../controllers/user');

const controllers = require('../controllers/user');

const router = express.Router();


router.get('/secret/:userId', isAuth, isAdmin, (req, res, next) => {
  res.status(200).json({
    user: req.profile2
  });
});

router.put('/edited/:userId', controllers.editedById);

router.get('/by-id/:userId', controllers.fetchById);

router.get('/all', controllers.fetchAll);


// router.param('userId', userRouter.userById);



module.exports = router;