/* eslint-disable prefer-destructuring */
const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.get('/user-dashboard', async (req, res) => {
    res.render("user/user-dashboard.ejs");
});

module.exports = router;