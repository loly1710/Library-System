const express = require('express');
const router = express.Router();
const multer = require('multer');
const Book = require('../models/book.js');

// render a list of all books (Read all)
router.get('/', async(req, res) => {
    try{
        const populatedBooks = await Book.find();
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
/*router.post('/', async(req, res) => {
    req.body.userType = req.session.user._id
    await Books.create(req.body)
    res.redirect('/books')
})*/

// Multer setup for file upload
const upload = multer({ dest: 'uploads/' });

router.post('/books', upload.single('CoverImg'), async (req, res) => {
    try {
        // Validate all required fields are present in req.body
        const { title, author, isbn, description, publicationYear, availableCopies, specificGenre, pages, category } = req.body;
        console.log("params: ", title, author, isbn, description, publicationYear, availableCopies);
        console.log("REQ: ", req.body);
        if (!title || !author || !isbn || !description || !publicationYear || !availableCopies || !req.file) {
            
            return res.status(400).send('All fields are required');
        }

        // Create a new book document
        const newBook = new Book({
            title,
            author,
            isbn,
            description,
            publicationYear: publicationYear,
            availableCopies: Number(availableCopies),
            specificGenre,
            category,
            pages,
            userType: req.session.user._id,
            coverImg: req.file.path // assuming you save the file path
        });

        await newBook.save();
        res.redirect('/books');
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).send('Internal Server Error');
    }
});

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
        const currentBook = await Book.findById(req.params.bookId);
        res.render('books/edit.ejs', {
            book: currentBook,
        });
    }catch(error){
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;