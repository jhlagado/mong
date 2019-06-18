const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// validator
const expressValidator = require('express-validator');

// passport stuff
const session = require('express-session');
const passport = require('passport');

const expressMessages = require('express-messages');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// handle sessions
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: false
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// validator
// validator
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

app.use(require('connect-flash')());

app.use((req, res, next) => {
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

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
