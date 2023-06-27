const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

const connectDb = require('./configs/database');

const setService = require('./services/setService');

connectDb()
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log(`DB error: ${err}`));

app.get('/', async (req, res) => {
  try {
    const data = await setService.get('75320');
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => console.log(`Server listenng on ${PORT}`));
