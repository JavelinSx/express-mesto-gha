const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const userRouter = require('./users');
const cardRouter = require('./cards');
const {
  createUser,
  login,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const { LINK_REGEX } = require('../utils/const');
const { NOT_FOUND } = require('../utils/errors');

const app = express();

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Неккоректный email');
    }),
    password: Joi.string().required(),
    avatar: Joi.string().custom((value, helpers) => {
      if (LINK_REGEX.test(value)) {
        return value;
      }
      return helpers.message('Неккоректная ссылка');
    }),
  }),

}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Неккоректный email');
    }),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);
app.use(userRouter);
app.use(cardRouter);

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'По указанному пути ничего не найдено' });
});

module.exports = app;
