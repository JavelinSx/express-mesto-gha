const { Joi } = require('celebrate');

const { LINK_REGEX } = require('./const');

const validateRegisterUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(LINK_REGEX),
  }),
};
const validateLoginUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const validateAuthUser = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(LINK_REGEX),
  }),
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
};

module.exports = {
  validateRegisterUser,
  validateLoginUser,
  validateAuthUser,
};
