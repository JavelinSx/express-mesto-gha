const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:idCard', deleteCard);
router.put('/:idCard/likes', likeCard);
router.delete('/:idCard/likes', dislikeCard);

module.exports = router;
