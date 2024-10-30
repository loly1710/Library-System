const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: [
        "Children's Books",
        "Science & Technology",
        "History",
        "Health & Wellness",
        "Business & Economics",
        "Art & Photography",
        "Poetry",
        "Cookbooks",
        "Education",
        "Mystery & Thrillers",
        "Romance",
        "Others"
    ],
    default: "Others",
    required: true
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  publishedYear: {
    type: Number,
    required: true,
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0,
  },
  ISBN: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
