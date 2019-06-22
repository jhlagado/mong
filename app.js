const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const customerRoutes = require('./routes/customer');
const Customer = require('./models/customer');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const customerKeys = [
  'id', 'first_name', 'last_name',
  'email', 'gender', 'ip_address',
];
app.use('/api/customers', customerRoutes(Customer, customerKeys));

app.get('/', (_req, res) => {
  res.redirect('/api/customers/');
});

module.exports = app;
