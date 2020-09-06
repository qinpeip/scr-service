const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  phone: String,
  age: String,
  gender: String,
  id: Number,
  createAt: Date,
  updateAt: Date,
});

const UserModel = mongoose.model('scr_users', UserSchema);

module.exports = UserModel;