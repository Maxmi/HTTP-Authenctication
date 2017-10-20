const express = require('express');
const router = express.Router();
const {check, validationResult }  = require('express-validator/check');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
  req.checkBody('email', 'Cannot be empty').isEmail();
  req.checkBody('password', 'Cannot be empty').len(3, 8);
  req.checkBody('confirmPswd', 'Should match password').equals(req.body.password);

  const errors = req.getValidationErrors();
  if (errors) {
    console.log(`errors: ${JSON.stringify(errors)}`);
    res.render('/signup', {
      title: 'Signup Error',
      errors: errors
    });
  } else {
    // const userData = {
    //   email: req.body.email,
    //   password: req.body.password
    // };
    const email = req.body.email;
    const password = req.body.password
    
    bcrypt.hash(password, saltRounds, (err, hash) => {
      //use db method to insert userData into db
      addUser(email, hash);
      res.cookie('userID', req.body.email);
      res.redirect('/', {
        title: 'Signup complete'
      });
      // } else {
      //   signupError('Please provide an email and a password to sign up', next);
      // }
    })
  }
  // if (req.body.email &&
  //   req.body.password &&
  //   req.body.confirmPswd) {
  // 
  //   //confirm that user typed the same password twice
  //   if (req.body.password !== req.body.confirmPswd) {
  //     signupError('Passwords do not match', next);
  //   }
  // 




});

//route to login page - GET 
router.get('/login', (req, res, next) => {
   res.render('login');
})

//route to login page - POST  
router.post('/login', [
  check('email', 'Cannot be empty').isEmail(),
  check('password', 'Cannot be empty').isLength({min:3, max:8})
], (req, res, next) => {
  const errors = validationResult(req);
  console.log(`errors: ${errors.array()}`);
  if(!errors.isEmpty()) {
    console.log('entered here')
    res.render('/loginerr', {
      // errors: errors.array({onlyFirstError: true})
      errors: [{msg: 'error text'}]
    });
  }
  // if (req.body.email && req.body.password) {
  //   getUser(req.body.email, req.body.password).then(result => {
  //     console.log(result);
  //     if (!result) {
  //       const err = new Error('Incorrect email or password.');
  //       err.status = 401;
  //       next(err);
  //     } else {
  //       req.session.userID = result.email;
  //       res.redirect('/');
  //     }
  //   });
  // } else {
  //   const err = new Error('Please provide an email and a password to login');
  //   err.status = 401;
  //   next(err);
  // }
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