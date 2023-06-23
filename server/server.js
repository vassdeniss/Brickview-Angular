const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Works!');
});

app.listen(PORT, () => console.log(`Server listenng on ${PORT}`));
