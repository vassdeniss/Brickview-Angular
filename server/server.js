const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

const connectDb = require('./configs/database');

const routes = require('./routes');

connectDb()
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log(`DB error: ${err}`));

app.get('/', (req, res) => {
  res.send('slash');
});

app.use(routes);

app.listen(PORT, () => console.log(`Server listenng on ${PORT}`));
