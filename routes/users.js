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
    console.log(req.body);
  })
module.exports = router;
