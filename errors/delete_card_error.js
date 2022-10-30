const { DEL_CARD } = require('../utils/errors');

class DeleteCardError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = DEL_CARD;
  }
}

module.exports = DeleteCardError;
