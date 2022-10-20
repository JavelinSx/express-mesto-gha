const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.post('/users', createUser);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
