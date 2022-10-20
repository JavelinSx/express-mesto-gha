const router = require('express').Router();
const {
  getUser,
  getUsers,
  createUser,
  updateUserProfile,
  updateMeAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('', createUser);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateMeAvatar);

module.exports = router;
