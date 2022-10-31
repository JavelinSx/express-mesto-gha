const jwt = require('jsonwebtoken');
const BadAuthError = require('../errors/bad_auth');
const { TOKEN_DEV } = require('../utils/const');

const auth = (req, res, next) => {
  const { token } = req.cookies;

  let playload;

  try {
    playload = jwt.verify(token, TOKEN_DEV);
    req.user = playload;
    next();
  } catch (err) {
    next(new BadAuthError('Необходима авторизация'));
  }
};
module.exports = { auth };
