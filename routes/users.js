const router = require('express').Router();
const {
  getUser,
  getUsers,
  createUser,
  updateUserProfile,
  updateMeAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', createUser);
router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', updateMeAvatar);

module.exports = router;
