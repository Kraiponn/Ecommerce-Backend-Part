const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// const crypto = require('crypto');
// const uuidv1 = require('uuid/v1');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  about: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: Number,
    default: 0
  },
  history: {
    type: Array,
    default: []
  }
}, { timestamps: true });


userSchema.methods.generateToken = function(payload, secretKey, expired) {
  const token = jwt.sign(
    payload,
    secretKey,
    { expiresIn: expired }
  );

  return token;
}


module.exports = mongoose.model("User", userSchema);


// Virtual field
// userSchema.virtual('password')
// .set(function(password){
//   this._password = password,
//   this.salt = uuidv1(),
//   tihs.hashed_password = this.encryptPassword(password)
// })
// .get(function() {
//   return this._password
// });

// userSchema.methods = {
//   encryptPassword: function(password) {
//     if(!password) return '';
//     try {
//       return crypto.createHmac('sha1', this.salt)
//                 .update(password)
//                 .digest('hex');
//     } catch(err) {
//       return '';
//     }
//   }
// };

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     trim: true,
//     required: true,
//     maxlength: 32
//   },
//   email: {
//     type: String,
//     trim: true,
//     required: true,
//     unique: 32
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   hashed_password: {
//     type: String,
//     trim: true
//   },
//   about: {
//     type: String,
//     trim: true
//   },
//   salt: String,
//   role: {
//     type: Number,
//     default: 0
//   },
//   history: {
//     type: Array,
//     default: []
//   }
// }, { timestamps: true });
