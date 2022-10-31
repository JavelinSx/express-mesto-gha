const Card = require('../models/card');
const BadRequestError = require('../errors/bad_request');
const NotFoundError = require('../errors/not_found_error');
const BadAuthError = require('../errors/bad_auth');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.idCard)
    .then((cards) => {
      if (!cards) {
        throw new BadAuthError('Карточка с указанным _id не найдена.');
      } else if (!cards.owner.equals(req.user._id)) {
        throw new BadAuthError('Попытка удалить чужую карточку.');
      } else {
        return cards.remove().then(() => res.status(200).send(cards));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadAuthError('Переданы некорректные данные при удалении карточки.'));
      }
      return next;
    });
};
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.idCard,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для изменения лайка.'));
      }
      return next(err);
    });
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.idCard,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      return res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для изменения лайка.'));
      }
      return next(err);
    });
};
