function loggedOut(req, res, next) {
  if(req.session && req.session.userId) {
    return res.redirect('/');
  }
  return next();
}

function loginRequired(req, res, next) {
  if(!req.session.userId) {
    res.redirect('/login');
  } else {
    next();
  }
}

