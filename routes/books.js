const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

 /** 
   * @swagger
   * /books:
   *  get:
   *    tags:
   *      - API Requests
   *    summary: Get all books
   *    responses:
   *      '200':
   *        description: Success
   */

//Get
router.get('/', async (req,res) => {
    try{
        const books = await Book.find()
        res.json(books)
    }catch(err){
        res.json({message: err})
    }
});

router.get("/:id", async (req,res) => {
    try{
        const books = await Book.findById(req.params.id)
            res.json(books)
        }catch(err){
            res.json({message: err})
        }
});


/*router.post('/', async (req, res) => {
    try{
    const createBook = await Book.create(req.body)
      res.json(createBook) 
    }catch(err){
        res.json({message: err})
    }
});*/

/**
 * @swagger
 * /books/{id}:
 *  patch:
 *    tags:
 *      - API Requests
 *    summary: update a book
 *    parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        description: book ID
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object  
 *            properties:
 *              title:
 *                type: string
 *              ISBN:
 *                type: integer
 *              price:
 *                type: integer
 *    responses:
 *      '200':
 *        description: OK
 */

//Update
router.put('/put/:id', async (req,res) => {
    try{
        const updatedBook = await Book.updateMany(
            {_id: req.params.id},
            {$set: { title: req.body.title, ISBN: req.body.ISBN, price: req.body.price}})
        res.json(updatedBook);
    }catch(err){
        res.json({message: err});
    }
})

/**
 * @swagger
 * /books/{id}:
 *  delete:
 *    tags:
 *      - API Requests
 *    summary: delete a book
 *    parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        description: book ID
 *    responses:
 *      '200':
 *        description: OK
 */

//Delete
 router.delete('/delete/:id', async (req,res)=> {
    try{
        const deletedBook = await Book.remove({ _id: req.params.id})
        res.json(deletedBook)
    }catch(err){
        res.json({message: err})
    }
})

module.exports = router;