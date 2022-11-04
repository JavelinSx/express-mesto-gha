const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const BadAuthError = require('../errors/bad_auth');
const { LINK_REGEX } = require('../utils/const');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: (value) => LINK_REGEX.test(value),
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => {
      if (validator.isEmail(value)) {
        return true;
      }
      return false;
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .orFail(new BadAuthError('Необходима авторизация'))
    .then((user) => bcrypt
      .compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(new BadAuthError('Необходима авторизация'));
        }
        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);
