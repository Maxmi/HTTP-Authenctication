const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const {
  addUser,
  getUser
} = require('../db/db_utils');

//route to home page
router.get('/', (req, res) => {
  return res.render('index', {
    //read email from cookie if it exists 
    email: req.session.userID
  })
});

//route to signup page - GET 
router.get('/signup', (req, res) => {
  res.render('signup', {
    title: 'Sign Up',
    error: '',
    email: req.session.userID
  })
});

//route to signup page - POST
router.post('/signup', (req, res) => {
  const {
    email,
    password,
    confirmPswd
  } = req.body;

  //confirm that user filled all inputs
  if (!(email || password || confirmPswd)) {
    res.render('signup', {
      title: 'Sign Up',
      error: 'Please provide email and password to sign up'
    });
  }
  //confirm that user typed the same password twice
  else if (password !== confirmPswd) {
    res.render('signup', {
      title: 'Sign Up',
      error: 'Passwords do not match'
    });
  } else {
    //hash the password and add user info to db
    bcrypt.hash(password, saltRounds, (err, hash) => {
      addUser(email, hash)
        .then(user => {
          //start tracking the user 
          req.session.userID = user.email;
          res.redirect('/');
        })
        .catch(err => {
          res.render('signup', {
            title: 'Sign Up',
            error: 'Could not add user to database'
          })
          // return err;
        })
    })
  }
});


//route to login page - GET 
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Log In',
    error: '',
    email: req.session.userID
  });
});

router.post('/login', (req, res) => {
  const {
    email,
    password
  } = req.body
  //check if user filled both inputs 
  if (!email || !password) {
    res.render('login', {
      title: 'Log In',
      error: 'Please provide email and password to log in'
    });
  } else { 
    //query db with provided credentials
    getUser(email, password)
      .then(data => {
        //compare provided password with the one in db
        bcrypt.compare(password, data.password)
        .then(result => {
          //if comparison result is true (passwords match)
          if(result) {
            req.session.userID = data.email;
            res.redirect('/');
          } else {
            res.render('login', {
              title: 'Log In',
              error: 'Incorrect email or password'
            });
          }
        })
      })
      .catch(err => {
        res.render('login', {
          title: 'Log In',
          error: 'User not found'
        })
        // return err;
      })
  }
});

//route to logout 
router.get('/logout', (req, res, next) => {
  //if this is authenticated user - delete cookies 
  if (req.session) {
    req.session = null;
    res.redirect('/');
  } else {
    return next();
  }
});


module.exports = router;