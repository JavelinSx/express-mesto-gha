const { INTERNAL_SERVER } = require('../utils/errors');

module.exports = (err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVER
        ? `err.name = ${err.name} ; err.message = ${err.message} ; Ошибка по умолчанию.`
        : message,
    });
  return next();
};
