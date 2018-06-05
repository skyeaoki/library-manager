var express = require('express');
var router = express.Router();
const Patron = require('../models').Patron;
const Loan = require('../models').Loan;
const Book = require('../models').Book;

// prepares validation errors for convenient display
let attachPatronsErrorMessages = (err, object) => {
  // if there are validation errors then assign each one's message to a property on the given object
  if(err.errors) {
    for(i = 0; i < err.errors.length; i++) {
      if(err.errors[i].path == 'first_name') {
        object.first_name = err.errors[i].message;
      } else if (err.errors[i].path == 'last_name') {
        object.last_name = err.errors[i].message;
      } else if (err.errors[i].path == 'address') {
        object.address = err.errors[i].message;
      } else if (err.errors[i].path == 'email') {
        object.email = err.errors[i].message;
      } else if (err.errors[i].path == 'library_id') {
        object.library_id = err.errors[i].message;
      } else if (err.errors[i].path == 'zip_code') {
        object.zip_code = err.errors[i].message;
      }
    }
  } else {
    console.error(err);
    res.sendStatus(500);
  }
};

// GET all patrons
router.get('/', (req, res, next) => {
  Patron.findAll().then( patrons => {
    res.render('patrons/index', {patrons, title: 'Patrons' });
  });
});

// GET create a new patron form
router.get('/new', (req, res, next) => {
  res.render('patrons/new', {title: 'New Patron', errorMessages: 'null'});
});

// POST create a new patron
router.post('/new', (req, res, next) => {
  let errorMessages = {};
  let patronData = req.body;

  // create a new patron entry with the form data
  Patron.create(req.body).then( patron => {
    res.redirect('/patrons');
  }).catch( err => {
    if(err) {
      attachPatronsErrorMessages(err, errorMessages);
      res.render('patrons/new-error', {patron: patronData, errorMessages});
    }
  });
});

// GET individual patron details
router.get('/:id', (req, res, next) => {
  // find patron by id url parameter
  Patron.findById(req.params.id).then( patron => {
    // get all loans associated with this book
    Loan.findAll({
      where: {
        patron_id: req.params.id
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
      if(patron) {
        res.render('patrons/details', {patron, loans, title: patron.first_name + ' ' + patron.last_name , errorMessages: 'null'});
      } else {
        res.sendStatus(404);
      }
    });
  });
});

// Edit individual patron details
router.put('/:id', (req, res, next) => {
  let patronData;
  let errorMessages={};

  // find patron by id url parameter
  Patron.findById(req.params.id)
    .then( patron => {
      patronData = patron;
      // update patron details with form data
      return patron.update(req.body);
    })
    .then( patron => {
      res.redirect('/patrons');
    })
    .catch( err => {
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
        attachPatronsErrorMessages(err, errorMessages);
        res.render('patrons/details', { patron: patronData, loans, errorMessages});
        });
      }
    });
});

module.exports = router;
