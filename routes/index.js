const express = require('express');
const router = express.Router();

//route to home page
router.get('/', (req, res, next) => {
  return res.render('index', { title: 'Home' });
});


//route to about page
router.get('/about', (req, res, next) => {
  return res.render('about', { title: 'About' });
});

//route to contact page
router.get('/contact', (req, res, next) => {
  return res.render('contact', { title: 'Contact' });
});


module.exports = { router };