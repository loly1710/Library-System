/* eslint-disable prefer-destructuring */
const express = require("express");
const User = require("../models/user");
const Book = require("../models/book");

const router = express.Router();

router.get('/employee-dashboard', async (req, res) => {
    const employee = await User.findById(req.session.user._id);
    const bookCount = await Book.countDocuments({addedBy: employee._id});
    const books = await Book.find({ addedBy: employee._id });
    res.render("employee/employee-dashboard.ejs", {
        employee,
        bookCount,
        books
    });
});

module.exports = router;