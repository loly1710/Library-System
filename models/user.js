const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  dateOfBirth: {
    type: Date,
    required: true,
  },

  gender:{
    type: String,
    required: true,
  },

  userType: {
    type: String,
    enum : ['employee','normal'],
    default: 'normal',
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;


