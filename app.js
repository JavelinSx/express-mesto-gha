require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const handlerErrors = require('./utils/errors');
const routes = require('./routes/routes');

const { PORT = 3000 } = process.env;

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
  statusCode: handlerErrors.MANY_REQUEST,
  standardHeaders: true,
  legacyHeaders: false,
});
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function connected() {
  try {
    mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
    });
  } catch (err) {
    console.log(err);
  }
  app.listen(PORT, () => {
    console.log(`App listeind o port ${PORT}`);
  });
}

app.use(limiter);
app.use(helmet());
app.use(routes);
app.use(errors());
app.use(handlerErrors);
connected();
