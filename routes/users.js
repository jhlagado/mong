const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          return done(null, user);
        }
      }
      done(null, null);
    } catch (err) {
      done(err);
    }
  }
));

const router = express.Router();

router.route('/register')

  .get((_req, res) => {
    res.render('register', { title: 'Register' });
  })

  .post((req, res) => {

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

      const { name, email, username, password } = req.body;

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

router.route('/logout')

  .get((req, res) => {
    req.logout();
    req.flash('success', 'You are now logged out');
    res.redirect('/users/login');
  });

module.exports = router;
