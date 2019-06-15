var express = require('express');
var router = express.Router();

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
module.exports = router;
