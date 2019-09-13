const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');

const Customer = require('./models/customer');

const indexRouter = require('./routes/index');
const customerRoutes = require('./routes/customer');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const customerKeys = [
  'id', 'first_name', 'last_name',
  'email', 'gender', 'ip_address',
];

app.use('/', indexRouter);
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
