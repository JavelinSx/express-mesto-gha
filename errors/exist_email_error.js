const { EXIST_EMAIL } = require('../utils/errors');

class ExistEmailError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = EXIST_EMAIL;
  }
}

module.exports = ExistEmailError;
