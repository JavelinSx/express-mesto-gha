const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NOT_FOUND } = require('./utils/errors');

const { PORT = 3000 } = process.env;

const app = express();
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(helmet());
app.use((req, res, next) => {
  req.user = {
    _id: '6351a4ec6f072e2e8d3f4d5a',
  };
  next();
});
app.use('/cards', cardsRouter);
app.use('/users', userRouter);

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'По указанному пути ничего не найдено' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
