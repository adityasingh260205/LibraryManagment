// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    genre: { type: String, required: true },
    publisher: { type: String, required: true },
    publicationYear: { type: Number },
    totalCopies: { 
        type: Number, 
        required: true, 
        min: [1, 'Total copies must be a positive number'] 
    },
    availableCopies: { type: Number },
    shelfLocation: { type: String },
    bookType: { 
        type: String, 
        enum: ['Reference', 'Circulating'],
        default: 'Circulating'
    },
    status: { 
        type: String, 
        enum: ['Available', 'Checked Out'], 
        default: 'Available' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);