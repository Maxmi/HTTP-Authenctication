const express = require('express');
const router = express.Router();
const {
  addUser,
  getUser
} = require('../db/db_utils');

//route to home page
router.get('/', (req, res, next) => {
  return res.render('index');
});

//route to signup page - GET 
router.get('/signup', (req, res, next) => {
  return res.render('signup');
});


const signupError = (text, next) => {
  const err = new Error(text);
  err.status = 400;
  return next(err);
};

//route to signup page - POST
router.post('/signup', (req, res, next) => {
  // return res.send('User created!');
  if (req.body.email &&
    req.body.password &&
    req.body.confirmPswd) {

    //confirm that user typed the same password twice
    if (req.body.password !== req.body.confirmPswd) {
      signupError('Passwords do not match', next);
    }

    const userData = {
      email: req.body.email,
      password: req.body.password
    };

    //use db method to insert userData into db
    addUser(userData);
    res.cookie('userID', req.body.email);
    res.redirect('/');
  } else {
    signupError('All fields required.', next);
  }
});

//route to login page - GET 
router.get('/login', (req, res, next) => {
  return res.render('login');
})

//route to login page - POST  
router.post('/login', (req, res, next) => {
  if (req.body.email && req.body.password) {
    getUser(req.body.email, req.body.password).then(result => {
      console.log(result);
      if (!result) {
        const err = new Error('Wrong email or password.');
        err.status = 401;
        next(err);
      } else {
        req.session.userID = result.email;
        res.redirect('/');
      }
    });
  } else {
    const err = new Error('Email and password are required.')
    err.status = 401;
    next(err);
  }
});

//route to logout 
router.get('/logout', (req, res, next) => {
  if (req.session) {
    //delete session object
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    })
  }
});


module.exports = router;