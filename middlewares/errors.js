module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? `err.name = ${err.name} ; err.message = ${err.message} ; Ошибка по умолчанию.`
        : message,
    });
  return next();
};
