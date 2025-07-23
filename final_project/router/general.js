const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  let { username, password } = req.body;
  if(!username || !password) {
    res.status(400).json({ message: "Username and password are required."});
  }
  if(isValid(username)) {
    users.push({ username, password });
    res.status(200).json({ message: "User successfully registered!"})
  } else {
    res.status(400).json({ message: "Username already exists."});
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  let book = books[isbn];
  if (book) {
    return res.status(200).json({ book: book });
  }
  return res.status(404).json({ message: "Book not found" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  let author = req.params.author;
  let matchedBooks = [];
  for(let isbn in books) {
    if(books[isbn].author.toLowerCase() == author.toLowerCase()) {
      matchedBooks.push(books[isbn]);
    }
  }
  if (matchedBooks.length > 0) {
    return res.status(200).json({ booksbyauthor: matchedBooks });
  }
  return res.status(404).json({message: "No books found by this author"});
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  let title = req.params.title;
  let matchedBooks = [];
  for(let isbn in books) {
    if(books[isbn].title.toLowerCase() == title.toLowerCase()) {
      matchedBooks.push(books[isbn]);
    }
  }
  if (matchedBooks.length > 0) {
    return res.status(200).json({ booksbytitle: matchedBooks });
  }
  return res.status(404).json({message: "No books found by this title"});
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
