const bodyParser = require('body-parser');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const express = require('express');
const expressMessages = require('express-messages');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const logger = require('morgan');
const path = require('path');
const passport = require('passport');
const session = require('express-session');

const Customer = require('./models/customer');

const indexRouter = require('./routes/index');
const customerRoutes = require('./routes/customer');
const usersRouter = require('./routes/users');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter(param, msg, value) {
    const namespace = param.split('.');
    const root = namespace.shift();
    let formParam = root;

    while (namespace.length) {
      formParam += `[${namespace.shift()}]`;
    }
    return {
      param: formParam,
      msg,
      value
    };
  }
}));

app.use(function(req, res, next) {
  res.locals.messages = expressMessages(req, res);
  next();
});
app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  console.log('req local user', res.locals.user);
  next();
});

const customerKeys = [
  'id', 'first_name', 'last_name',
  'email', 'gender', 'ip_address',
];

app.use('/', indexRouter);
app.use('/customers', customerRoutes(Customer, customerKeys));
app.use('/users', usersRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
