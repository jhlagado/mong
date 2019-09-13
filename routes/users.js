const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/login', function(req, res, next) {
 res.render('login', { title: 'Login' });
});

router.route('/register')
  .get((_req, res) => {
    res.render('register', { title: 'Register' });
  })
  .post((req, res) => {

    const { name } = req.body;
    const { email } = req.body;
    const { username } = req.body;
    const { password } = req.body;

    console.log(req.file);

    // Form validator
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Confirm-password field is required').notEmpty();
    req.checkBody('password2', 'Password not match').equals(req.body.password);

    // Check errors
    const errors = req.validationErrors();
    if (errors) {
      res.render('register', { errors });
    } else {
      const newUser = new User({
        name,
        email,
        username,
        password: bcrypt.hashSync(password, 10),
      });
      newUser.save();
      req.flash('success', 'You are now registered and can login.');
      res.redirect('/');
    }
  });

module.exports = router;
