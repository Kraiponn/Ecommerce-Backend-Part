const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();

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
app.use(cookieParser());

// Routes Middlewares
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoute);
app.use("/api", productRoute);

// Handler Error
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const msg = error.message;
  const data = error.data;
  res.status(status).json({ error: msg, data: data });
});


const port = process.env.PORT || 8000
// Connect mongoose
mongoose
  .connect(process.env.DATA_BASE, {
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