const express = require('express');
const Author = require("../models/Author");
const Book = require('../models/Book');
//const Book = require('../models/Book');
const router = express.Router();

/**
 * @swagger
 * /authors:
 *  get:
 *    tags:
 *      - API Requests
 *    summary: Get all authors
 *    responses:
 *      '200':
 *        description: Success
 */
router.get("/", async (req,res) => {
    try{
        const authors = await Author.find()
            res.json(authors)
        }catch(err){
            res.json({message: err})
        }
});

router.get("/:id", async (req,res) => {
    try{
        const authors = await Author.findById(req.params.id).populate("books")
            res.json(authors)
        }catch(err){
            res.json({message: err})
        }
});

/**
 * @swagger
 * /authors:
 *  post:
 *    tags:
 *      - API Requests
 *    summary: add a new author
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object  
 *            properties:
 *              name:
 *                type: string
 *              age:
 *                type: integer
 *    responses:
 *      '200':
 *        description: OK
 */

//POST authors
router.post('/', async (req, res) => {
    try{
    const createAuthor = await Author.create(req.body)
      res.json(createAuthor) 
    }catch(err){
        res.json({message: err})
    }
});

/**
 * @swagger
 * /authors/{id}:
 *  post:
 *    tags:
 *      - API Requests
 *    summary: add a new book to an author
 *    parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        description: author ID
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

router.post("/:id", async (req, res) => {
    try {
      const createBook = await Book.create(req.body);
      const insertedBook = await Author.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { books: createBook._id } },
        { new: true }
      );
      res.json(insertedBook);
    } catch (error) {
      res.json(error);
    }
  });


/**
 * @swagger
 * /authors/{id}:
 *  patch:
 *    tags:
 *      - API Requests
 *    summary: update an author
 *    parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        description: author ID
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object  
 *            properties:
 *              name:
 *                type: string
 *              age:
 *                type: integer
 *    responses:
 *      '200':
 *        description: OK
 */

 router.put('/put/:id', async (req,res) => {
    try{
        const updatedAuthor = await Author.updateMany(
            {_id: req.params.id},
            {$set: { name: req.body.name, age: req.body.age}})
        res.json(updatedAuthor);
    }catch(err){
        res.json({message: err});
    }
})

/**
 * @swagger
 * /authors/{id}:
 *  delete:
 *    tags:
 *      - API Requests
 *    summary: delete an author
 *    parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        description: author ID
 *    responses:
 *      '200':
 *        description: OK
 */

//Delete
 router.delete('/delete/:id', async (req,res)=> {
    try{
        const deletedAuthor = await Author.remove({ _id: req.params.id})
        res.json(deletedAuthor)
    }catch(err){
        res.json({message: err})
    }
})


module.exports = router;