const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  let { username, password } = req.body;
  if(!username || !password) {
    return res.status(400).json({ message: "Username and password are required."});
  }
  if(isValid(username)) {
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered!"})
  } else {
    return res.status(400).json({ message: "Username already exists."});
  }
});

const getAllBooksAsync = async () => {
  return books;
};

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    let allBooks = await getAllBooksAsync();
    res.status(200).json({ books: allBooks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books." });
  }
});

const getBooksByISBNAsync = async (isbn) => {
  if (books[isbn]) {
        return books[isbn];
    } else {
        throw new Error("Book not found");
    }
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    try {
        const book = await getBooksByISBNAsync(isbn);
        return res.status(200).json(book);
    } catch (error) {
        console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
        return res.status(404).json({ message: error.message });
    }
});

const getBooksByAuthorAsync = async (author) => {
  const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
    if (matchingBooks.length > 0) {
        return matchingBooks;
    } else {
        throw new Error("Books by this author not found");
    }
};

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const author = req.params.author;
    try {
        const matchedBooks = await getBooksByAuthorAsync(author);
        return res.status(200).json({ booksbyauthor: matchedBooks });
    } catch (error) {
        console.error(`Error fetching books by author ${author}:`, error.message);
        return res.status(404).json({ message: error.message });
    }
});

const getBooksByTitleAsync = async (title) => {
  const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
    if (matchingBooks.length > 0) {
        return matchingBooks;
    } else {
        throw new Error("Books with this title not found");
    }
}

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const title = req.params.title;
    try {
        const matchedBooks = await getBooksByTitleAsync(title);
        return res.status(200).json({ booksbytitle: matchedBooks });
    } catch (error) {
        console.error(`Error fetching books with title ${title}:`, error.message);
        return res.status(404).json({ message: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book && Object.keys(book.reviews).length > 0) {
    return res.status(200).json({ reviews: book.reviews });
  }
  return res.status(404).json({message: "No reviews found for this book"});
});

module.exports.general = public_users;
