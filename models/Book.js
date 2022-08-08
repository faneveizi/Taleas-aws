const mongoose = require('mongoose');
const Schema = require('mongoose');

const booksSchema = mongoose.Schema({
    title: String,
    ISBN: Number,
    price: Number
});

module.exports = mongoose.model("Books",booksSchema); 