/* eslint-disable prefer-destructuring */
const express = require("express");
const User = require("../models/user");
const auth = require("../config/auth");

const router = express.Router();

router.get("/sign-up", async (req, res) => {
  res.render("auth/sign-up.ejs", { errors: [], formData: {} });
});

router.post('/sign-up', async (req, res) => {
  const { name, username, email, password, confirmPassword, gender, type } = req.body;
  
  let errors = [];

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    errors.push('Username or email is already taken');
  }

  if (password !== confirmPassword) {
    errors.push("Passwords don't match!");
  }

  const validGenders = ["Male", "Female"];
  if (!validGenders.includes(gender)) {
    errors.push("Invalid gender selection");
  }

  if (errors.length > 0) {
    return res.render('auth/sign-up.ejs', { errors, formData: req.body });
  }

  const hashPassword = auth.encryptPassword(password);
  
  const payload = {
    name,
    username,
    email,
    password: hashPassword,
    gender,
  };

  try {
    const newUser = await User.create(payload);
    
    req.session.user = {
      username: newUser.username,
      _id: newUser._id,
      type: 'user'
    };

    req.session.save(() => {
      res.redirect('/');
    });
  } catch (error) {
    res.status(500).send('Error creating user');
  }
});

router.get("/sign-in", async (req, res) => {
  res.render("auth/sign-in.ejs", { errors: [] });
});

router.post('/sign-in', async (req, res) => {
  const { username, password } = req.body;
  let errors = [];

  try {
    const user = await User.findOne({ username });
    if (!user) {
      errors.push('Login failed, please try again');
      return res.render('auth/sign-in', { errors });
    }

    const validPassword = auth.comparePassword(password, user.password);
    if (!validPassword) {
      errors.push('Login failed, please try again');
      return res.render('auth/sign-in', { errors });
    }

    req.session.user = {
      username: user.username,
      _id: user._id,
      type: user.type
    };

    req.session.save(() => {
      res.redirect('/');
    });
  } catch (error) {
    errors.push('An unexpected error occurred. Please try again.');
    res.render('auth/sign-in', { errors });
  }
});

router.get("/sign-out", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
