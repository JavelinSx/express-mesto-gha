const Card = require('../models/card');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER,
} = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(OK).send({ cards });
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER).send({ message: `Произошла ошибка на сервере. ${err.message}` });
    });
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      card.populate('owner')
        .then((dataCard) => {
          res.status(OK).send(dataCard);
        })
        .catch((err) => res.status(INTERNAL_SERVER).send({ message: `Произошла ошибка на сервере. ${err.message}` }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: `Переданы некорректные данные карточки. ${err.message}` });
      }
      return res.status(INTERNAL_SERVER).send({ message: `Произошла ошибка на сервере. ${err.message}` });
    });
};
module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => card.remove().then(() => res.status(200).send(card)))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: `Переданы некорректные данные карточки. ${err.message}` });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Не найдена карточка с указанным _id.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: `Произошла ошибка на сервере. ${err.message}` });
    });
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(OK).send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: `Переданы некорректные данные карточки. ${err.message}` });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Не найдена карточка с указанным _id.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: `Произошла ошибка на сервере. ${err.message}` });
    });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(OK).send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: `Переданы некорректные данные карточки. ${err.message}` });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Не найдена карточка с указанным _id.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: `Произошла ошибка на сервере. ${err.message}` });
    });
};
