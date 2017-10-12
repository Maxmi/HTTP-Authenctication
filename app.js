const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

//parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { encoded: false }));

//serve static files from /public
app.use(express.static(__dirname + '/public'));

//setup views
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

//routes
const routes = require('./routes/index');
app.use('/', routes);

//catch 404
app.use((req, res, next) => {
  const err = new Error('File not found');
  err.status = 404;
  next();
});

//error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//listen 
app.listen(port, () => {
  console.log('App is listening on port ' + port);
});

module.exports = { app };