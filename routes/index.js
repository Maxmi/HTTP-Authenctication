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
    email: req.session.userID
  });
});

//route to signup page - GET 
router.get('/signup', (req, res) => {
  //if this is authenticated user - redirect him to home page 
  if (req.session) {
    res.redirect('/');
  } else { 
    //if not - let him sign up
    res.render('signup', {
      title: 'Sign Up',
      error: ''
    });
  }
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
    })
  }
  //confirm that user typed the same password twice
  if (password !== confirmPswd) {
    res.render('signup', {
      title: 'Sign Up',
      error: 'Passwords do not match'
    })
  } else { //hash the password and add user info to db
    bcrypt.hash(password, saltRounds, (err, hash) => {
      addUser(email, hash)
        .then(user => { //start tracking the user 
          req.session.userID = user.email;
          res.redirect('/');
        })
        .catch(err => {
          res.render('signup', {
            title: 'Sign Up',
            error: 'Could not add user to the database'
          })
          return err;
        })
    })
  }
});

//route to login page - GET 
router.get('/login', (req, res) => {
  //if this is authenticated user - redirect him to home page 
  if (req.session) {
    res.redirect('/');
  } else {
    //if not - let him log in
    res.render('login', {
      title: 'Log In',
      error: ''
    });
  }
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
  } else { //query db with provided credentials
    getUser(email, password)
      .then(data => {
        if (email !== data.email || password !== data.password) {
          res.render('login', {
            title: 'Log In',
            error: 'Incorrect email or password'
          });
        } else { //start tracking
          req.session.userID = data.email;
          res.redirect('/');
        }
      })
      .catch(err => {
        res.render('login', {
          title: 'Log In',
          error: 'There is no such user in our database'
        })
        return err;
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