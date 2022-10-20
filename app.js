const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NOT_FOUND } = require('./utils/errors');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use((req, res, next) => {
  req.user = {
    _id: '6351a4ec6f072e2e8d3f4d5a',
  };
  next();
});
app.use(cardsRouter, userRouter);

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'По указанному пути ничего не найдено' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
