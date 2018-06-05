const express = require('express');
const router = express.Router();
const Loan = require('../models').Loan;
const Book = require('../models').Book;
const Patron = require('../models').Patron;
const moment = require('moment');
const Sequelize = require('sequelize');
// sequelize operator
const Op= Sequelize.Op;

// gets the current date and formats it
let getDate = () => moment().format().toString().substring(0,10);

// gets the date one week from now and formats it
let getDateOneWeekLater = () => moment().add(7, 'days').format().toString().substring(0,10);

// prepares validation errors for convenient display
let attachLoansErrorMessages = (err, object) => {
  // if there are validation errors then assign each one's message to a property on the given object
  if(err.errors) {
    for(let i = 0; i < err.errors.length; i++) {
      if(err.errors[i].path === 'loaned_on' ) {
        object.loaned_on = err.errors[i].message;
      } else if (err.errors[i].path === 'return_by') {
        object.return_by = err.errors[i].message;
      }
      else if (err.errors[i].path === 'returned_on') {
       object.returned_on = err.errors[i].message;
     }
    }
  } else {
    console.error(err);
    res.sendStatus(500);
  }
};

// GET all loans
router.get('/', (req, res, next) => {
  Loan.findAll({
    // include book and patron models to get the book title and patron name for each loan
    include: [
      {
        model: Book,
      },
      {
        model: Patron
      }
    ]
  }).then( loans => {
    res.render('loans/index', {loans, title: 'Loans' });
  }).catch(err => {
    if(err) {
      res.sendStatus(500);
    }
  });
});

// GET overdue loans
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
    include: [
      {
        model: Book,
      },
      {
        model: Patron
      }
    ]
  }).then( loans => {
    res.render('loans/index', {loans, title: 'Overdue Loans' });
  }).catch(err => {
    if(err) {
      res.sendStatus(500);
    }
  });
});

// GET checked out loans
router.get('/checked-out', (req, res, next) => {
  let todaysDate = getDate();

  // get all checked out loans
  Loan.findAll({
    where: {
      // have not been returned
      returned_on: null,
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
    res.render('loans/index', {loans, title: 'Checked Out Books' });
  }).catch(err => {
    if(err) {
      res.sendStatus(500);
    }
  });
});

// GET create a new loan form
router.get('/new', (req, res, next) => {
  let todaysDate = getDate();
  let oneWeekLater = getDateOneWeekLater();

  // get all patrons for option selector
  Patron.findAll().then( patrons => {
    // get all books for option selector
    Book.findAll().then( books => {
      res.render('loans/new', {todaysDate, oneWeekLater, books, patrons, title: 'New Loan', errorMessages: 'null'});
    });
  });
});

// POST create a new loan
router.post('/new', (req, res, next) => {
  let errorMessages = {};
  // store the form data so that when validation errors occur, valid input values can be re-rendered
  let loansData = req.body;
  let todaysDate = getDate();
  let oneWeekLater = getDateOneWeekLater();

  // get all patrons for option selector
  Patron.findAll().then( patrons => {
    // get all books for option selector
    Book.findAll().then( books => {
      // create a new loan with form data
      Loan.create(req.body).then( loan => {
        res.redirect('/loans');
      }).catch( err => {
        if(err) {
          attachLoansErrorMessages(err, errorMessages);
          res.render('loans/new-error', {todaysDate, oneWeekLater, loans: loansData, books, patrons, title: 'New Book', errorMessages});
        }
      });
    });
  });
});


// GET return loan
router.get('/:id/return', (req, res, next) => {
  let todaysDate = getDate();

  // get loan (using id url param)
  Loan.findById(req.params.id, {
    include: [
      {
        model: Book,
      },
      {
        model: Patron
      }
    ]
  }).then( loan => {
    if(loan) {
      res.render('loans/return-book', { todaysDate, loan, title: 'Return Book', errorMessages: 'null'});
    }
  }).catch(err => {
    if(err) {
      res.sendStatus(500);
    }
  });
});

// Return a book
router.put('/:id/return', (req, res, next) => {
  let loanData;
  let errorMessages = {};

  // get loan
  Loan.findById(req.params.id, {
    include: [
      {
        model: Book,
      },
      {
        model: Patron
      }
    ]
  })
  .then( loan => {
    loanData = loan;
    // update loan with form input
    return loan.update(req.body);
  })
  .then( loan => {
    res.redirect('/loans');
  })
  .catch( err => {
    if(err) {
      attachLoansErrorMessages(err, errorMessages);
    }
    res.render('loans/return-book', { loan: loanData, title: 'Return Book', errorMessages: errorMessages });
  });
});

// GET loan details
router.get('/:id', (req, res, next) => {
  // get all patrons for option selector
  Patron.findAll().then( patrons => {
    // get all books for option selector
    Book.findAll().then( books => {
      // get loan
      Loan.findById(req.params.id, {
        include: [
          {
            model: Book,
          },
          {
            model: Patron
          }
        ]
      }).then( loan => {
        if(loan) {
          res.render('loans/details', {loan, books, patrons, title: loan.Book.title, errorMessages: 'null'});
        }
      });
    });
  });
});

// Edit loan details
router.put('/:id', (req, res, next) => {
  let loanData;
  let errorMessages = {};

  // get all patrons for option selector
  Patron.findAll().then( patrons => {
    // get all books for option selector
    Book.findAll().then( books => {
      // get loan
      Loan.findById(req.params.id, {
        include: [
          {
            model: Book,
          },
          {
            model: Patron
          }
        ]
      })
      .then( loan => {
        loanData = loan;
        // update loan with form data
        return loan.update(req.body);
      })
      .then( loan => {
        res.redirect('/loans');
      })
      .catch( err => {
        if(err) {
          attachLoansErrorMessages(err, errorMessages);
        }
        res.render('loans/details', { loan: loanData, books, patrons, title: loan.Book.title, errorMessages });
      });
    });
  });
});

module.exports = router;
