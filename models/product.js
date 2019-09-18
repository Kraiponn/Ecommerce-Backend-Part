const mongoose = require('mongoose');
// const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 32
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    required: true,
    trim: true,
    maxlength: 32
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  quantity: {
    type: Number
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  shopping: {
    type: Boolean,
    require: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);