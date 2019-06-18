const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, (_req, res) => {
  console.log(res.locals.user);
  res.render('index', { title: 'Members' });
});

function ensureAuthenticated(_req, res, next) {
  if (_req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
