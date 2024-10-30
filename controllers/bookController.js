const express = require("express");
const upload = require("../config/multer");
const Book = require("../models/book");
const user = require("../models/user");

const router = express.Router();
const bookCategories = [
  {
    name: "Children's Books",
    backgroundColor: "#FFCC80",
  },
  {
    name: "Science & Technology",
    backgroundColor: "#B3E5FC",
  },
  {
    name: "History",
    backgroundColor: "#D1C4E9",
  },
  {
    name: "Health & Wellness",
    backgroundColor: "#C8E6C9",
  },
  {
    name: "Business & Economics",
    backgroundColor: "#FFAB91",
  },
  {
    name: "Art & Photography",
    backgroundColor: "#E1BEE7",
  },
  {
    name: "Poetry",
    backgroundColor: "#FFF9C4",
  },
  {
    name: "Cookbooks",
    backgroundColor: "#FFCDD2",
  },
  {
    name: "Education",
    backgroundColor: "#C5CAE9",
  },
  {
    name: "Mystery & Thrillers",
    backgroundColor: "#B2DFDB",
  },
  {
    name: "Romance",
    backgroundColor: "#F8BBD0",
  },
  {
    name: "Others",
    backgroundColor: "#E0E0E0",
  },
];

router.get("/add", async (req, res) => {
  const type = req.session.user.type;
  if (!type || type !== "employee") {
    res.redirect("/");
  }
  res.render("book/add.ejs", { bookCategories });
});

router.post("/add", upload.single("coverImage"), async (req, res) => {
  const type = req.session.user.type;
  if (!type || type !== "employee") {
    res.redirect("/");
  }
  try {
    const {
      title,
      author,
      genre,
      publishedYear,
      availableCopies,
      ISBN,
      category,
      description,
    } = req.body;
    const coverImage = req.file
      ? `/uploads/${req.file.filename}`
      : "/assets/no-cover.jpg";

    const newBook = new Book({
      title,
      author,
      genre,
      publishedYear,
      availableCopies,
      ISBN,
      category,
      description,
      coverImage,
      addedBy: req.session.user._id,
    });

    await newBook.save();

    res.redirect("/");
  } catch (error) {
    console.error("Error adding book:", error);
    res.redirect("/");
  }
});

router.get("/view-book/:bookId", async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  if (!book) {
    res.redirect("/");
  }
  res.render("book/viewBook.ejs", { book });
});

router.get("/view-categories", async (req, res) => {
  res.render("book/booksCategories.ejs", { bookCategories });
});

router.get("/view-books/:category?", async (req, res) => {
  let category = req.query.category;
  let books = [];
  if (!category) {
    books = await Book.find();
  } else {
    books = await Book.find({ category: { $regex: category, $options: "i" } });
  }
  const employeeId = req.session.user._id;
  res.render("book/allBooks.ejs", { books, employeeId });
});

router.get("/update/:bookId", async (req, res) => {
  const type = req.session.user.type;
  if (!type || type !== "employee") {
    res.redirect("/");
  }
  const book = await Book.findById(req.params.bookId);
  if (!book) {
    res.redirect("/");
  }
  res.render("book/updateBook.ejs", { book, bookCategories });
});

router.put("/update/:bookId", upload.single("coverImage"), async (req, res) => {
  const type = req.session.user.type;
  if (!type || type !== "employee") {
    res.redirect("/");
  }
  const book = await Book.findById(req.params.bookId);
  if (!book) {
    res.redirect("/");
  }

  try {
    const {
      title,
      author,
      category,
      genre,
      publishedYear,
      availableCopies,
      ISBN,
      description,
    } = req.body;

    let coverImage = book.coverImage;

    if (req.file) {
      coverImage = `/uploads/${req.file.filename}`;
    }

    book.set({
      title,
      author,
      genre,
      category,
      publishedYear,
      availableCopies,
      ISBN,
      description,
      coverImage,
    });
    await book.save();

    res.redirect("/");
  } catch (error) {
    console.error("Error updating book:", error);
    res.redirect("/");
  }
});

router.delete("/delete/:bookId", async (req, res) => {
  const type = req.session.user.type;
  if (!type || type !== "employee") {
    res.redirect("/");
  }
  const book = await Book.findById(req.params.bookId);
  if (!book) {
    res.redirect("/");
  }
  if (req.session.user._id !== book.addedBy._id.toString()) {
    res.send("You don't have permission to do that.");
  }
  await book.deleteOne();
  res.redirect("/");
});

module.exports = router;
