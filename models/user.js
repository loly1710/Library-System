const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
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
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  type: {
    type: String,
    enum: ["employee", "user"],
    default: "user",
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
