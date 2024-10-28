const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  dateOfBirth: {
    type: Date,
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


