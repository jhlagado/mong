const mongoose = require('mongoose');
const Customer = require('../models/customer');

const run = async() => {

  await mongoose.connect('mongodb://localhost:27017/db', { useNewUrlParser: true } );
  await mongoose.connection.dropDatabase();
  mongoose.connection.close();

};

run();
