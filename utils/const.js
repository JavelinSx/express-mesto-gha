const crypto = require('crypto');

const TOKEN_DEV = crypto.randomBytes(16).toString('hex');
const LINK_REGEX = /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/;

module.exports = {
  LINK_REGEX,
  TOKEN_DEV,
};
