const router = require('express').Router();
const { celebrate } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const {
  createUser,
  login,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { validUnlogUser } = require('../utils/userShema');
const NotFoundError = require('../errors/not_found_error');

router.post('/signup', celebrate(validUnlogUser), createUser);
router.post('/signin', celebrate(validUnlogUser), login);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
