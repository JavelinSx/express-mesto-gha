const { BAD_AUTH } = require('../utils/errors');

class BadAuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_AUTH;
  }
}

module.exports = BadAuthError;
