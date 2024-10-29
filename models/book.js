const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    isbn: {
        type: String,
        required: true,
    },

    puplicationYear: {
        type: Date,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    coverImg: {
        type: String,
        required: true,
    },

    pages: {
        type: Number,
        required: true,
    },

    availableCopies: {
        type: Number,
        required: true,
    },

    category: {
        type: String,
        required: true,
        enum: ['Education', 'Literature & Classics', "Children's Books", 'Health & Wellness'],
    },

    specificGenre: {
        type: String,
        required: true,
    },

    userType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})

const Book = mongoose.model('book', bookSchema);

module.exports = Book