const mongoose = require('mongoose');
const Schema = require('mongoose');

/*const bookSchema = mongoose.Schema({
    title: String,
    ISBN: Number,
    price: Number,
});*/

const authorsSchema = new mongoose.Schema({
    name: String,
    age: Number,
    books: [{
        type: Schema.Types.ObjectId,
        ref: "Books"
    }]
});
 
//var Books = mongoose.model('Books',bookSchema);//
module.exports = mongoose.model('Authors',authorsSchema);
//module.exports = Books;//