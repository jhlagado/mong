const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');

// file upload
const multer = require('multer');

const upload = multer({ dest: 'public/uploads' });

// passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

/* GET users listing. */
router.get('/', (_req, res) => {
  res.send('respond with a resource');
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

router.route('/register')
  .get((_req, res) => {
    res.render('register', { title: 'Register' });
  })
  .post(upload.single('profileImage'), (req, res) => {
    const { name } = req.body;
    const { email } = req.body;
    const { username } = req.body;
    const { password } = req.body;

    console.log(req.file);

    // if there is a file
    let profileImage;
    if (req.file) {
      console.log('Uploading File ...');
      profileImage = req.file.filename;
    } else {
      console.log('No File Uploaded ...');
      profileImage = 'noimage.jpg';
    }
    console.log(profileImage);

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
        profileImage: `uploads/${profileImage}`
      });
      newUser.save();
      req.flash('success', 'You are now registered and can login.');
      res.redirect('/');
    }
  });
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
});

module.exports = router;
