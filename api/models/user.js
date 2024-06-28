var mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const userSchema = new mongoose.Schema({

  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,

  },
  role: {
    type: String,
    required: true,
    enum: ['owner', 'guest'],
    default: 'guest'
  }


})

const User = mongoose.model('User', userSchema)
module.exports = {
  User
};
