const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const BadAuthError = require('../errors/bad_auth');
const { TOKEN_DEV } = require('../utils/const');

module.exports.auth = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie || !cookie.startsWith('token=')) {
    next(new BadAuthError('Необходима Авторизация'));
  }
  const token = cookie.replace('token=', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : TOKEN_DEV);
  } catch (err) {
    next(new BadAuthError('Необходима Авторизация'));
  }

  req.user = payload;
  next();
};
