const jwt = require('jsonwebtoken');
const BadAuthError = require('../errors/bad_auth');

module.exports.auth = (req, res, next) => {
  const { token } = req.cookies;
  const { JWT_SECRET } = process.env;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);

    console.log(payload);
  } catch (err) {
    next(new BadAuthError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
