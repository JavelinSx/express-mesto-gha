const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { TOKEN_DEV } = require('../utils/const');
const BadRequestError = require('../errors/bad_request');
const NotFoundError = require('../errors/not_found_error');
const BadAuthError = require('../errors/bad_auth');
const ExistEmailError = require('../errors/exist_email_error');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : TOKEN_DEV,
        { expiresIn: '7d' },
      );
      res
        .cookie('token', token, {
          maxAge: 3600000,
          httpOnly: true,
        })
        .send({ message: 'Авторизация прошла успешно' });
    })
    .catch(() => {
      next(new BadAuthError('Неправильные почта или пароль.'));
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send({
        name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        return next(new ExistEmailError('Передан уже зарегистрированный email.'));
      }
      return next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(new NotFoundError(`Пользователь с id ${userId} не найден`))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new NotFoundError(`Пользователь с id ${userId} не найден`))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError(`Пользователь с id ${req.user._id} не найден`))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный id пользователя'));
      }
      return next(err);
    });
};
module.exports.updateMeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError(`Пользователь с id ${req.user._id} не найден`))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
      }
      return next(err);
    });
};
