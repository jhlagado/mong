const express = require('express');
const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const expressMessages = require('express-messages');
const session = require('express-session');
const expressValidator = require('express-validator');
const passport = require('passport');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiCustomerRoutes = require('./routes/api/customer');
const Customer = require('./models/customer');
const customerRoutes = require('./routes/customer');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cors());
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
app.use('/', indexRouter);
app.use('/users', usersRouter);

const customerKeys = [
  'id', 'first_name', 'last_name',
  'email', 'gender', 'ip_address',
];
app.use('/api/customers', apiCustomerRoutes(Customer, customerKeys));
app.use('/customers', customerRoutes(Customer, customerKeys));

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
