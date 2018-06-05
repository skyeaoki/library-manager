const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;
const moment = require('moment');
const Sequelize = require('sequelize');
// sequelize operators
const Op= Sequelize.Op;

// gets the current date and formats it
let getDate = () => moment().format().toString().substring(0,10);

// prepares validation errors for convenient display
let attachBooksErrorMessages = (err, object) => {
  // if there are validation errors then assign each one's message to a property on the given object
  if(err.errors) {
    for(i = 0; i < err.errors.length; i++) {
      if(err.errors[i].path === 'title') {
        object.title = err.errors[i].message;
      } else if (err.errors[i].path === 'author') {
        object.author = err.errors[i].message;
      } else if (err.errors[i].path === 'genre') {
        object.genre = err.errors[i].message;
      } else if (err.errors[i].path === 'first_published') {
        object.first_published = err.errors[i].message;
      }
    }
  } else {
    console.error(err);
    res.sendStatus(500);
  }
};

// GET all books
router.get('/', (req, res, next) => {
  Book.findAll().then( books => {
    res.render('books/index', {books, title: 'Books' });
  });
});

// GET overdue Books
router.get('/overdue', (req, res, next) => {
  let todaysDate = getDate();
  // get all overdue loans
  Loan.findAll({
    where: {
      // have not been returned
      returned_on: null,
      return_by: {
        // "less than" todays date (dates before today)
        [Op.lt]: todaysDate
      }
    },
    // include the associated book
    include: [
      {
        model: Book,
      }
    ]
  }).then( loans => {
    res.render('books/filter', {loans, title: 'Overdue Books' });
  });
});

// GET checked out Books
router.get('/checked-out', (req, res, next) => {
  let todaysDate = getDate();

  // get all checked out loans
  Loan.findAll({
    where: {
      // have not been returned
      returned_on: null
    },
    // include the associated book
    include: [
      {
        model: Book,
      }
    ]
  }).then( loans => {
    res.render('books/filter', {loans, title: 'Checked Out Books' });
  });
});

// GET create a new book form
router.get('/new', (req, res, next) => {
  res.render('books/new', {title: 'New Book'});
});

// POST create a new book
router.post('/new', (req, res, next) => {
  let errorMessages = {};
  // store the form data so that when validation errors occur, valid input values can be re-rendered
  let bookData = req.body;

  // create a new book entry using the form data
  Book.create(req.body).then( book => {
    res.redirect('/books');
  }).catch( err => {
    if(err) {
      attachBooksErrorMessages(err, errorMessages);
      res.render('books/new-error', {book: bookData, errorMessages});
    }
  });
});

// GET individual book details
router.get('/:id', (req, res, next) => {
  // get book using id url param
  Book.findById(req.params.id).then( book => {
    // get all loans associated with this book
    Loan.findAll({
      where: {
        book_id: req.params.id
      },
      include: [
        {
          model: Book,
        },
        {
          model: Patron
        }
      ]
    }).then( loans => {
      if(book) {
        res.render('books/details', {book, loans, title: book.title , errorMessages: 'null'});
      // if no book is found send 404
      } else {
        res.sendStatus(404);
      }
    }).catch(err => {
      if(err) {
        sendStatus(500);
      }
    });
  });
});

// Edit individual book details
router.put('/:id', (req, res, next) => {
  let bookData;
  let loansData;
  let errorMessages = {};

  // get book
  Book.findById(req.params.id).then( book => {
    bookData = book;
    // update the book details with the form data
    return book.update(req.body);
  }).then( () => {
    res.redirect('/books');
  }).catch( err => {
    if(err) {
      // get all loans associated with the book to re-render the page
      Loan.findAll({
        where: {
          book_id: req.params.id
        },
        include: [
          {
            model: Book,
          },
          {
            model: Patron
          }
        ]
      }).then(loans => {
        attachBooksErrorMessages(err, errorMessages);
        res.render('books/details', { book: bookData, loans, errorMessages});
      });
    }
  });
});

module.exports = router;
