const User = require('../models/user');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER,
} = require('../utils/errors');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка на сервере.' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка на сервере.' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params._id)
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: `Пользователь с _id:${req.params._id} не найден` });
      }
      return res.status(INTERNAL_SERVER).send({ message: `Произошла ошибка на сервере. ${err.message}` });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.status(OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя.' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: `Пользователь с id:${req.user._id} не найден` });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка на сервере.' });
    });
};
module.exports.updateMeAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя.' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: `Пользователь с id:${req.user._id} не найден` });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка на сервере.' });
    });
};
