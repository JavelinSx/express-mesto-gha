const router = require('express').Router();
const { celebrate } = require('celebrate');
const { validLogUser } = require('../utils/userShema');
const {
  getUser,
  getUsers,
  updateUserProfile,
  updateMeAvatar,
} = require('../controllers/users');

router.get('/', celebrate(validLogUser), getUsers);
router.get('/me', celebrate(validLogUser), getUser);
router.get('/:userId', celebrate(validLogUser), getUser);
router.patch('/me', celebrate(validLogUser), updateUserProfile);
router.patch('/me/avatar', celebrate(validLogUser), updateMeAvatar);

module.exports = router;
