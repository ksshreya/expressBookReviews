const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  if (!username || typeof username !== "string" || username.trim().length === 0) {
    return false;
  }
  let user = users.find(user => user.username === username);
  return !user;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let matchingUser = users.find(user => user.username === username && user.password === password);
  return matchingUser !== undefined;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  let { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      { data: username },
      'access',
      { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,
      username
    }
    return res.status(200).json({ message: "User successfully logged in" })
  } else {
    return res.status(400).json({ message: "Invalid login. Check username and password." })
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization.username;
  if (!review) {
    return res.status(400).json({ message: "Review is required." });
  }
  if (!books[isbn]) {
    return res.status(400).json({ message: "Book not found." });
  }
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: `Review for ISBN ${isbn} has been added/modified by ${username}`, reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; 
    const username = req.session.authorization.username; 

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: `Review for ISBN ${isbn} by ${username} deleted successfully.`, reviews: books[isbn].reviews });
    } else {
        return res.status(404).json({ message: `No review found for ISBN ${isbn} by user ${username}.` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
