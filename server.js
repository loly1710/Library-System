const express = require("express");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const addUserToViews = require("./middlewares/addUserToViews");
const path = require('path');

require("dotenv").config();
require("./config/database");

//Controllers
const authController = require('./controllers/auth');
const userController = require('./controllers/userController');
const employeeController = require('./controllers/employeeController');
const bookController = require('./controllers/bookController');

const { requireRole } = require("./middlewares/roleRequired");

const app = express();

const port = process.env.PORT ? process.env.PORT : 3000;

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride("_method"));

app.use(morgan("dev"));

app.set('view engine', 'ejs');



app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      dbName: 'lms',
      collectionName: 'sessions'
    }),
  })
);

app.use(addUserToViews);

// Public Routes
app.get('/', async (req, res) => {
  if(req.session.user){
    if (req.session.user.type === "employee"){
      return res.redirect('/employee/employee-dashboard');
    }
    else if (req.session.user.type === "user"){
      return res.redirect('/book/view-categories');
    }
  }
  res.render('index.ejs');
});

app.use('/auth', authController);
app.use('/user', requireRole('user'), userController);
app.use('/employee', requireRole("employee") ,employeeController);

const uploadDir = path.join(__dirname, 'uploads');
const assetsDir = path.join(__dirname, 'assets');
app.use('/uploads', express.static(uploadDir));
app.use('/assets', express.static(assetsDir));

app.use('/book', bookController);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
