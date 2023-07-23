const express = require('express');
const cors = require('cors');

function addMiddlewares(app) {
  app.use(
    cors({
      origin: ['http://localhost:3000', 'https://legoview-api.onrender.com'],
    })
  );
  app.use(express.json({ limit: '500mb' }));
  app.use(express.urlencoded({ extended: false, limit: '500mb' }));
}

module.exports = addMiddlewares;
