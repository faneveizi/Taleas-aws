const connectToDatabase = require("./db");
const Author = require("./models/Author")
const Book = require("./models/Book");

const createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    error: message || "An Error occurred.",
  }),
});
const returnError = (error) => {
  console.log(error);
  if (error.name) {
    const message = `Invalid ${error.path}: ${error.value}`;
    callback(null, createErrorResponse(400, `Error:: ${message}`));
  } else {
    callback(
      null,
      createErrorResponse(error.statusCode || 500, `Error:: ${error.name}`)
    );
  }
};

module.exports.getAuthors = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectToDatabase();
    const authors = await Author.find();
    if (!authors) {
      callback(null, createErrorResponse(404, "No author Found."));
    }

    callback(null, {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : '*' // Required for CORS support to work
 // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify(authors),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.getAllBooks = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectToDatabase();
    const books = await Book.find();
    if (!books) {
      callback(null, createErrorResponse(404, "No book Found."));
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(books),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.getOneAuthor = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;

  try {
    await connectToDatabase();
    const author = await Author.findById(id).populate("books");

    if (!author) {
      callback(null, createErrorResponse(404, `No author found with id: ${id}`));
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(author),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.getOneBook = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;

  try {
    await connectToDatabase();
    const book = await Book.findById(id);

    if (!book) {
      callback(null, createErrorResponse(404, `No book found with id: ${id}`));
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(book),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.postAuthor = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { name, age } = JSON.parse(event.body);

  const author = new Author({
    name,
    age
  });

  try {
    await connectToDatabase();
    console.log(author);
    const newAuthor = await Author.create(author);
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(newAuthor),
    });
  } catch (error) {
    returnError(error);
  }
};


module.exports.postBookAndAddToAuthor = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;
  const { title, ISBN, price } = JSON.parse(event.body);
  const book = new Book({
    title,
    ISBN,
    price
  });

 try {
  await connectToDatabase();
  const createBook = await Book.create(book);
    const insertedBook = await Author.findOneAndUpdate(
      { _id: id },
      { $push: { books: createBook._id } },
      { new: true }
    );

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(insertedBook),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.updateAuthor = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);

  const { name, age } = data;

  try {
    await connectToDatabase();

    const author = await Author.findById(event.pathParameters.id);

    if (author) {
      author.name = name || author.name;
      author.age = age || author.age;
    }

    const newAuthor = await author.save();

    callback(null, {
      statusCode: 204,
      body: JSON.stringify(newAuthor),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.updateBook = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);

  const { title, ISBN, price } = data;

  try {
    await connectToDatabase();

    const book = await Book.findById(event.pathParameters.id);

    if (book) {
      book.title = title || book.title;
      book.ISBN = ISBN || book.ISBN;
      book.price = price || book.price;
    }

    const newBook = await book.save();

    callback(null, {
      statusCode: 204,
      body: JSON.stringify(newBook),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.deleteAuthor = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;

  try {
    await connectToDatabase();
    const author = await Author.findByIdAndRemove(id);
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `Removed author with id: ${author._id}`,
        author,
      }),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.deleteBook = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;

  try {
    await connectToDatabase();
    const book = await Book.findByIdAndRemove(id);
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `Removed book with id: ${book._id}`,
        author,
      }),
    });
  } catch (error) {
    returnError(error);
  }
};
