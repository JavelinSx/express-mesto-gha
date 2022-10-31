require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const handlerErrors = require('./middlewares/errors');
const router = require('./routes/routes');

const { PORT = 3000 } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
});

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
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
app.use('/', router);
app.use(errors());
app.use(handlerErrors);
connected();
