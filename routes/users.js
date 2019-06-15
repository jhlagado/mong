const express = require('express');
const router = express.Router();

//file upload
const multer = require('multer');
const upload = multer({dest: 'public/uploads'});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.route('/login')
  .get((req, res) => {
    res.render('login', {title: 'Login'})
  })
router.route("/register")
  .get((req, res) => {
    res.render('register', { title: 'Register' });
  })
  .post(upload.single('profileImage'),(req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    console.log(req.file);

    //if there is a file
    if (req.file) {
      console.log('Uploading File ...');
      var profileImage = req.file.filename;
      console.log(profileImage);
    } else {
      console.log('No File Uploaded ...');
      var profileImage = 'noimage.jpg';
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
    let errors = req.validationErrors();
    if (errors) {
      res.render('register', {errors: errors});
    } else {
        console.log('no erros');
    }
  })
module.exports = router;
