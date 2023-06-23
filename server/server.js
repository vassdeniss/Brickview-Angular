const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

const connectDb = require('./configs/database');

connectDb()
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log(`DB error: ${err}`));

app.get('/', (req, res) => {
  res.send('Works!');
});

app.listen(PORT, () => console.log(`Server listenng on ${PORT}`));
