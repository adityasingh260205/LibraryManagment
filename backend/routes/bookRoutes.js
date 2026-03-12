// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// 1. SEARCH BOOKS (Must be placed BEFORE /:id route)
// GET /books/search?title=xyz or ?author=xyz
router.get('/search', async (req, res, next) => {
    try {
        const { title, author } = req.query;
        let query = {};
        
        // Use regex for case-insensitive partial matching
        if (title) query.title = { $regex: title, $options: 'i' };
        if (author) query.author = { $regex: author, $options: 'i' };

        const books = await Book.find(query);
        res.status(200).json(books);
    } catch (error) {
        next(error); // Passes to error handling middleware
    }
});

// 2. ADD A NEW BOOK
// POST /books
router.post('/', async (req, res, next) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook); // 201 Created
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'ISBN must be unique' });
        }
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
});

// 3. GET ALL BOOKS
// GET /books
router.get('/', async (req, res, next) => {
    try {
        const books = await Book.find();
        res.status(200).json(books); // 200 Success
    } catch (error) {
        next(error);
    }
});

// 4. GET BOOK BY ID
// GET /books/:id
router.get('/:id', async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' }); // 404 Not Found
        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
});

// 5. UPDATE BOOK DETAILS
// PUT /books/:id
router.put('/:id', async (req, res, next) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 6. DELETE BOOK RECORD
// DELETE /books/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;