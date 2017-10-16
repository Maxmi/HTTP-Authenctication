const express = require('express');
const router = express.Router();

//route to home page
router.get('/', (req, res, next) => {
  // return res.render('index', { title: 'Home' });
  return res.render('index');
});

//route to signup page - GET 
router.get('/signup', (req, res, next) => {
  // return res.render('signup', { title: 'Sign Up'});
  return res.render('signup');
});

//route to signup page - POST
router.post('/signup', (req, res, next) => {
  // return res.send('User created!');
  if(req.body.email &&
     req.body.password &&
     req.body.confirmPswd) {
       
       //confirm that user typed the same password twice
       if(req.body.password !== req.body.confirmPswd) {
         const err = new Error('Passwords do not match');
         err.status = 400;
         return next(err);
       }
       
       let userData = {
         email: req.body.email,
         password: req.body.password
       };
       
       //use db method to insert userData into db
        
       
     } else {
       const err = new Error ('All fields required.');
       err.status = 400;
       return next(err);
     }
});

//route to login page - GET 
router.get('/login', (req, res, next) => {
  return res.render('login');
})

//route to login page - POST  
router.post('/login', (req, res, next) => {
  // return res.send('Logged In!');
  if(req.body.email && req.body.password) {
    //user.authenticate (req.body.email, req.body.password, (err, user) => {
    //if(err || !user) {
    // const err = new Error ('Wrong email or password.');
    // err.status = 401;
    // return next(err);
  // } else {
  // req.session.userId = user._id;
  // return res.redirect('/profile');
// }
  // });
  } else {
    const err = new Error('Email and password are required.')
    err.status = 401;
    return next(err);
  }
});

//route to logout 
router.get('/logout', (req, res, next) => {
  if(req.session) {
    //delete session object
    req.session.destroy((err) => {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    })
  }
});


module.exports = router;