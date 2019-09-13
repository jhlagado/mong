const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      })
      .catch(err => done(err));
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

const router = express.Router();

router.route('/register')
  .get((_req, res) => {
    res.render('register', { title: 'Register' });
  })
  .post((req, res) => {

    const { name } = req.body;
    const { email } = req.body;
    const { username } = req.body;
    const { password } = req.body;

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

router.route('/login')
  .get((_req, res) => {
    res.render('login', { title: 'Login' });
  })
  .post(passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: 'Invalid Username or Password'
  }), (req, res) => {
    req.flash('success', 'You are now logged in');
    res.redirect('/');
  });

module.exports = router;
