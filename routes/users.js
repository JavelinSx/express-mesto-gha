const router = require('express').Router();
const { celebrate } = require('celebrate');
const { validateAuthUser } = require('../utils/userShema');
const {
  getUser,
  getUsers,
  updateUserProfile,
  updateMeAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', celebrate(validateAuthUser), getUsers);
router.get('/me', celebrate(validateAuthUser), getUserInfo);
router.get('/:userId', celebrate(validateAuthUser), getUser);
router.patch('/me', celebrate(validateAuthUser), updateUserProfile);
router.patch('/me/avatar', celebrate(validateAuthUser), updateMeAvatar);

module.exports = router;
