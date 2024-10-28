const express = require('express');
const router = express.Router();

const Books = require('../models/book.js');

// render a list of all books (Read all)
router.get('/', async(req, res) => {
    try{
        const populatedBooks = await Books.find();
        console.log('books:', populatedBooks);
        res.render('books.index.ejs', {
            books: populatedBooks
        })

    }catch(error){
        console.log(error);
        res.redirect('/');
    }
})

// render a new book from (create part 1)
router.get('/new', (req, res) => {
    res.render('books/new.ejs');
})

// create (submit new book form) (create part 2)
router.post('/', async(req, res) => {
    req.body.userType = req.session.user._id
    await Books.create(req.body)
    res.redirect('/books')
})

// show route (read one)
router.get('/:bookId', async(req, res) => {
    try{
        const populatedBook = await Books.findById(req.params.bookId).populate('userType');
        res.render('books/show.ejs', {
            book: populatedBook
        })
    }catch(error){
        console.log(error);
        res.redirect('/');
    }
})

// delete
router.delete('/:bookId', async(req,res) => {
    try{
        const book = await Books.findById(req.params.bookId);
        if(book.userType.equals(req.session.user._id)){
            await book.deleteOne()
            res.redirect('/books');

        }else{
            res.send("You don't have permission to do that.");
        }

    }catch(error){
        console.log(error);
        res.redirect('/');

    }
})

//controllers/books.js
router.get('/:bookId/edit', async(req, res) => {
    try{
        const currentBook = await Books.findById(req.params.bookId);
        res.render('books/edit.ejs', {
            book: currentBook,
        });
    }catch(error){
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;