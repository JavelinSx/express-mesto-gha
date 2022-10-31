const router = require('express').Router();
const { celebrate } = require('celebrate');
const { validGetCard, validCreateCard } = require('../utils/validationCard');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate(validCreateCard), createCard);
router.delete('/:idCard', celebrate(validGetCard), deleteCard);
router.put('/:idCard/likes', celebrate(validGetCard), likeCard);
router.delete('/:idCard/likes', celebrate(validGetCard), dislikeCard);

module.exports = router;
