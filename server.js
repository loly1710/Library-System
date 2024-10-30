const express = require("express");
const app = express();
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");

require("dotenv").config();
require("./config/database");

// Controllers + Middleware Imports
const isSignedIn = require("./middleware/isSignedIn.js");
const addUserToViews = require("./middleware/addUserToViews");
const authController = require("./controllers/auth.js");
const booksController = require("./controllers/books.js");

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";
//const path = require('path');

// MIDDLEWARE
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use(addUserToViews);

// Public Routes
app.get("/", async (req, res) => {
  if (req.session.user) {
    if (req.session.user.userType === "employee") {
      return res.redirect("/employee/employee-dashboard");
    } else if (req.session.user.userType === "user") {
      return res.redirect("/user/user-dashboard");
    }
  }
  res.render("index.ejs");
  /* {
    user: req.session.user,
  })*/
});

app.use("/auth", authController);

// Protected Routes
app.use(isSignedIn);

app.get("/protected", async (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.sendStatus(404);
    // res.send('Sorry, no guests allowed.');
  }
});

app.use("/books", isSignedIn, booksController);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`The express app is ready on port ${port}!`);
});
