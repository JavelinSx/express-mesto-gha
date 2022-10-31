const { Joi } = require('celebrate');

const { LINK_REGEX } = require('./const');

const validGetCard = {
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
};

const validCreateCard = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(LINK_REGEX),
  }),
};

module.exports = {
  validGetCard,
  validCreateCard,
};
