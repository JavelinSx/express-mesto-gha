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
  const { idCard } = req.params;
  Card.findById(idCard)
    .orFail(new NotFoundError(`Карточка с id ${idCard} не найдена`))
    .then((cards) => {
      if (!cards.owner.equals(req.user._id)) {
        throw new ForbiddenError('Попытка удалить чужую карточку.');
      }
      return Card.findByIdAndRemove(idCard)
        .then((card) => res.send(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при удалении карточки.'));
      }
      return next(err);
    });
};
module.exports.likeCard = (req, res, next) => {
  console.log(req);
  const { idCard } = req.params;
  Card.findByIdAndUpdate(
    idCard,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .orFail(new NotFoundError(`Карточка с id ${idCard} не найдена`))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для изменения лайка.'));
      }
      return next(err);
    })
    .catch(() => { console.log(req); });
};
module.exports.dislikeCard = (req, res, next) => {
  const { idCard } = req.params;
  Card.findByIdAndUpdate(
    idCard,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .orFail(new NotFoundError(`Карточка с id ${idCard} не найдена`))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для изменения лайка.'));
      }
      return next(err);
    });
};
