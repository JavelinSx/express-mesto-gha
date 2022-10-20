const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:idCard', deleteCard);
router.put('cards/:idCard/likes', likeCard);
router.delete('/cards/:idCard/likes', dislikeCard);

module.exports = router;
