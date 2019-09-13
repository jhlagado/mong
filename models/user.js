const mongoose = require('mongoose');

// access schema prop of mongoose
const { Schema } = mongoose;

// create instance of mongoose schema
const userSchema = new Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  name: {
    type: String
  },
});

const User = mongoose.model('User', userSchema);

// export the model/collection with the name of 'User'
module.exports = User;