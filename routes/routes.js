const router = require('express').Router();
const { celebrate } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const {
  createUser,
  login,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { validateRegisterUser, validateLoginUser } = require('../utils/userShema');
const NotFoundError = require('../errors/not_found_error');

router.post('/signup', celebrate(validateRegisterUser), createUser);
router.post('/signin', celebrate(validateLoginUser), login);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.get('/signout', (req, res) => { res.clearCookie('token').send({ message: 'Выход' }); });
router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
