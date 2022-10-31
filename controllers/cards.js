const Card = require('../models/card');
const BadRequestError = require('../errors/bad_request');
const NotFoundError = require('../errors/not_found_error');
const ForbiddenError = require('../errors/forbidden_error');

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
  const { _id } = req.user;
  Card.findById(_id)
    .orFail(new NotFoundError(`Карточка с id ${_id} не найдена`))
    .then((cards) => {
      if (!cards.owner.equals(_id)) {
        throw new ForbiddenError('Попытка удалить чужую карточку.');
      }
      return Card.findByIdAndRemove(_id)
        .then((card) => res.send(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при удалении карточки.'));
      }
      return next;
    });
};
module.exports.likeCard = (req, res, next) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    _id,
    { $addToSet: { likes: _id } },
    {
      new: true,
    },
  )
    .orFail(new NotFoundError(`Карточка с id ${_id} не найдена`))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для изменения лайка.'));
      }
      return next(err);
    });
};
module.exports.dislikeCard = (req, res, next) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    _id,
    { $pull: { likes: _id } },
    {
      new: true,
    },
  )
    .orFail(new NotFoundError(`Карточка с id ${_id} не найдена`))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для изменения лайка.'));
      }
      return next(err);
    });
};
