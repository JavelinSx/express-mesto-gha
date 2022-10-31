const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const BadAuthError = require('../errors/bad_auth');
const { TOKEN_DEV } = require('../utils/const');

module.exports.auth = (req, res, next) => {
  const { token } = req.cookies;
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new BadAuthError('Необходима Авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token || authorization.replace('Bearer ', ''), NODE_ENV === 'production' ? JWT_SECRET : TOKEN_DEV);
  } catch (err) {
    next(new BadAuthError('Необходима Авторизация'));
  }

  req.user = payload;
  next();
};
