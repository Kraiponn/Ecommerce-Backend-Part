const jwt = require('jsonwebtoken');
const config = require('config');


exports.isAuth = async (req, res, next) => {
  try{
    const authHeader = req.headers['x-auth-token'];
    if(!authHeader){
      const error = new Error('Access denied. No token provided.');
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    
    decodedToken = jwt.verify(token, config.get('tokenSecret'));

    if(!decodedToken){
      // console.log('Not authenticated Or token expired.');
      const error = new Error('Not authenticated Or token expired.');
      error.statusCode = 401;
      throw error;
    }
    
    // console.log('req.profile token ', decodedToken);
    req.profile = decodedToken;
    next();
  }catch(error) {
    if(!error.statusCode){
      error.statusCode = 500;
    }
    // console.log('err catch ', error.message);
    next(error);
  }
}

exports.isAdmin = (req, res, next) => {
  if(!req.profile.role || req.profile.role === 0){
    const error = new Error('Admin resource! Access denied.');
    error.statusCode = 403;
    throw error;
  }

  next();
}