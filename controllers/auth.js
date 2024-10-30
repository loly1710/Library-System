/* eslint-disable prefer-destructuring */
const express = require('express');
const User = require('../models/user');
const auth = require('../config/auth');

const router = express.Router();

const validateEmail = (email) => {
  if (typeof email !== 'string') return false; // Ensure email is a string
  const emailRegex = (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  return emailRegex.test(email);
};

const validateDateOfBirth = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const ageLimit = 18;
  const ageDate = new Date(Date.now() - dob.getTime());
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  return age >= ageLimit;
};

// Sign up
router.get('/sign-up', async (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
  // grab the values from the req body
  const username = req.body.username;
  const email = req.body.email;
  const dateOfBirth = req.body.dateOfBirth;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const gender = req.body.gender;

  // Email validation
  if (!validateEmail(email)) {
    return res.send('Invalid email format');
  }

  // Date of birth validation
  if (!validateDateOfBirth(dateOfBirth)) {
    return res.send('You must be at least 18 years old to sign up');
  }


  // Check if the user already exists
  const existingUser = await User.findOne({ username });

  // if the user exists,then dont bother doing anything, just send a message to the browser
  if (existingUser) {
    return res.send('Username is taken');
  }
  
  // verify that the password matches
  if (password !== confirmPassword) {
    return res.send("Passwords don't match!");
  }

  // create the user in the database
  // -b make the password secure
  const hashPassword = auth.encryptPassword(password);
  const payload = { username, email, dateOfBirth, password: hashPassword, gender };

  const newUser = await User.create(payload);
  // sign person in and redirect to home page
  req.session.user = {
    username: newUser.username,
    _id: newUser._id,
    userType: newUser.userType,
  };

  req.session.save(() => {
    res.redirect('/');
  });
});

// Sign in
router.get('/sign-in', async (req, res) => {
  res.render('auth/sign-in.ejs');
});

router.post('/sign-in', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // find a user from the username they filled out
  const user = await User.findOne({ username });
  // if the user doesnt exist, send an error msg
  if (!user) {
    return res.send('Login failed, please try again');
  }

  // compare the password they submitted with the password in the db
  const validPassword = auth.comparePassword(password, user.password);
  // if the password is no good, then send an error
  if (!validPassword) {
    return res.send('Login failed, please try again');
  }
  // else sign them in
  // create a session cookie
  req.session.user = {
    username: user.username,
    _id: user._id,
    //user: newUser.user
  };

  req.session.save(() => {
    res.redirect('/');
  });
});

// Sign out
router.get('/sign-out', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
