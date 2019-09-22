const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const config = require('config');

// require('dotenv').config();

// Import Route
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');

// App
const app = express();


// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/picture', express.static(path.join(__dirname, 'uploads')));


// Routes Middlewares
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);

// Handler Error
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const msg = error.message;
  const data = error.data;
  // res.status(status).json({ 
  //   error: msg,
  //   data: data
  // });
  res.status(status).json({ 
    errors: {
      msg: msg,
      data: data
    } 
  });
});


const port = config.get('port') || 8000
// Connect mongoose
mongoose
  .connect(config.get('mongoUri'), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connect mongoDB successfully.');
    app.listen(port, () => {
      console.log('Server is running on port ' + port);
    });
  })
  .catch(error => {
    console.log('Connected mongoDB failed.');
  });