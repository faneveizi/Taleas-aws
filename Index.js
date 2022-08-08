const express = require('express');
const mongoose = require('mongoose')
const app = express();
const cors = require('cors')
const Book = require("./models/Book")
const Author = require("./models/Author");
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const serverless = require('serverless-http');
require('dotenv/config')
app.use(express.urlencoded())
app.use(express.json())
app.use(cors())

const booksRoute = require('./routes/books')
const authorsRoute = require('./routes/authors');
app.use('/books', booksRoute)
app.use('/authors', authorsRoute)

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log('connected to db')
})


/*app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})*/

module.exports.handler = serverless(app);